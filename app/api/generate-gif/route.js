import axios from 'axios';

export async function POST(req) {
  try {
    // Extract image base64 from the request
    const { image_base64 } = await req.json();
    
    // Securely access API key
    const api_key = process.env.SEGMIND_MODEL_API_KEY;
    if (!api_key) {
      return new Response(
        JSON.stringify({ error: 'API key is missing' }),
        { status: 400 }
      );
    }

    const url = 'https://api.segmind.com/v1/live-portrait';

    const data = {
      face_image: image_base64,
      driving_video: 'https://segmind-sd-models.s3.amazonaws.com/display_images/liveportrait-video.mp4',
      live_portrait_dsize: 512,
      live_portrait_scale: 2.3,
      video_frame_load_cap: 128,
      live_portrait_lip_zero: true,
      live_portrait_relative: true,
      live_portrait_vx_ratio: 0,
      live_portrait_vy_ratio: -0.12,
      live_portrait_stitching: true,
      video_select_every_n_frames: 1,
      live_portrait_eye_retargeting: false,
      live_portrait_lip_retargeting: false,
      live_portrait_lip_retargeting_multiplier: 1,
      live_portrait_eyes_retargeting_multiplier: 1,
    };

    // Send POST request to the Segmind API
    const response = await axios.post(url, data, {
      headers: { 'x-api-key': api_key },
      responseType: 'arraybuffer', // Expecting binary video data
    });

    // Convert binary data to base64
    const base64Video = Buffer.from(response.data, 'binary').toString('base64');
    const videoUrl = `data:video/mp4;base64,${base64Video}`;

    // Return video URL in the response
    return new Response(JSON.stringify({ videoUrl }), { status: 200 });

  } catch (error) {
    // Improved error handling
    console.error('Error generating video:', error);
    const errorMessage = error.response?.data?.message || 'Failed to generate video';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500 }
    );
  }
}
