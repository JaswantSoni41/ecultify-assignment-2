// "use client";

// import { useState, useEffect } from 'react';
// import ImageUpload from '../components/ImageUpload';
// import VideoDisplay from '../components/VideoDisplay';
// import LoadingIndicator from '../components/LoadingIndicator';
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

// export default function Home() {
//   const [image, setImage] = useState(null);
//   const [videoUrl, setVideoUrl] = useState('');
//   const [gifUrl, setGifUrl] = useState('');
//   const [loading, setLoading] = useState(false);

//   const ffmpeg = createFFmpeg({ log: true });

//   const handleGenerateVideo = async () => {
//     if (!image) return;

//     setLoading(true);
//     setGifUrl(''); // Clear previous GIF

//     try {
//       const response = await fetch('/api/generate-gif', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ image_base64: image.split(',')[1] }),
//       });

//       if (!response.ok) throw new Error('Failed to generate video');
//       const result = await response.json();
//       setVideoUrl(result.videoUrl); // Set video URL for display
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   const handleConvertToGif = async () => {
//     if (!ffmpeg.isLoaded()) await ffmpeg.load();

//     setLoading(true);

//     try {
//       const videoData = await fetch(videoUrl).then(res => res.arrayBuffer());
//       ffmpeg.FS('writeFile', 'video.mp4', new Uint8Array(videoData));

//       // Run ffmpeg command to convert video to gif
//       await ffmpeg.run('-i', 'video.mp4', '-t', '2.5', '-vf', 'fps=10,scale=320:-1', 'output.gif');

//       // Read the resulting GIF file
//       const gifData = ffmpeg.FS('readFile', 'output.gif');
//       const gifBlob = new Blob([gifData.buffer], { type: 'image/gif' });
//       const gifUrl = URL.createObjectURL(gifBlob);

//       setGifUrl(gifUrl);
//     } catch (error) {
//       console.error('Error converting video to GIF:', error);
//     }
//     setLoading(false);
//   };

//   const handleDownloadGif = () => {
//     const link = document.createElement('a');
//     link.href = gifUrl;
//     link.download = 'img-to-gif-output.gif';
//     link.click();
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Real-Time GIF Generator</h1>
//       <ImageUpload onImageSelected={setImage} />
//       {image && <img src={image} alt="Preview" className="w-64 h-64 my-4 border border-gray-300" />}
//       <button onClick={handleGenerateVideo} className="bg-indigo-500 text-white mt-4 px-6 py-2 rounded">
//         Generate Video
//       </button>
//       {loading && <LoadingIndicator />}
//       {videoUrl && <VideoDisplay videoUrl={videoUrl} />}
//       {videoUrl && (
//         <button onClick={handleConvertToGif} className="bg-green-500 text-white mt-4 px-6 py-2 rounded">
//           Convert to GIF
//         </button>
//       )}
//       {gifUrl && (
//         <div className="flex flex-col items-center mt-6">
//           <img src={gifUrl} alt="Generated GIF" className="w-64 h-64 rounded-lg shadow-lg" />
//           <button onClick={handleDownloadGif} className="bg-purple-600 text-white mt-4 px-4 py-2 rounded">
//             Download GIF
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }



//2nd Version
"use client";

import { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import VideoDisplay from '../components/VideoDisplay';
import LoadingIndicator from '../components/LoadingIndicator';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export default function Home() {
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const ffmpeg = createFFmpeg({ log: true });

  const handleGenerateVideo = async () => {
    if (!image) return;

    setLoading(true);
    setGifUrl(''); // Clear previous GIF

    try {
      const response = await fetch('/api/generate-gif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_base64: image.split(',')[1] }),
      });

      if (!response.ok) throw new Error('Failed to generate video');
      const result = await response.json();
      setVideoUrl(result.videoUrl); // Set video URL for display
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleConvertToGif = async () => {
    if (!ffmpeg.isLoaded()) await ffmpeg.load();

    setLoading(true);

    try {
      const videoData = await fetch(videoUrl).then(res => res.arrayBuffer());
      ffmpeg.FS('writeFile', 'video.mp4', new Uint8Array(videoData));

      // Run ffmpeg command to convert video to gif
      await ffmpeg.run('-i', 'video.mp4', '-vf', 'fps=50,scale=320:-1', 'output.gif');

      // Read the resulting GIF file
      const gifData = ffmpeg.FS('readFile', 'output.gif');
      const gifBlob = new Blob([gifData.buffer], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(gifBlob);

      setGifUrl(gifUrl);
    } catch (error) {
      console.error('Error converting video to GIF:', error);
    }
    setLoading(false);
  };

  const handleDownloadGif = async () => {
    // If GIF hasn't been generated, generate it first
    if (!gifUrl) {
      await handleConvertToGif();
    }

    // Proceed with download once GIF is generated
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = 'img-to-gif-output.gif';
    link.click();
  };

  useEffect(() => {
    if (videoUrl) {
      handleConvertToGif(); // Automatically call handleConvertToGif when videoUrl is available
    }
  }, [videoUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Real-Time GIF Generator</h1>
      <ImageUpload onImageSelected={setImage} />
      {image && <img src={image} alt="Preview" className="w-64 h-auto my-4 border border-gray-300 rounded-lg" />}
      <button onClick={handleGenerateVideo} className="bg-indigo-500 text-white mt-4 px-6 py-2 rounded">
        Generate Video
      </button>
      {loading && <LoadingIndicator />}
      
      <div className="flex flex-col items-center mt-6">
        {gifUrl && <img src={gifUrl} alt="Generated GIF" className="w-64 h-auto rounded-lg shadow-lg" />}
        {videoUrl && (
          <button onClick={handleDownloadGif} className="bg-purple-600 text-white mt-4 px-4 py-2 rounded">
            Download GIF
          </button>
        )}
      </div>
    </div>
  );
}

