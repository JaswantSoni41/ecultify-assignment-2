// src/utils/api.js
import axios from 'axios';

export async function generateVideo(imageBase64) {
  try {
    const response = await axios.post('/api/generate-gif', { image_base64: imageBase64 });
    return response.data.videoUrl;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}
