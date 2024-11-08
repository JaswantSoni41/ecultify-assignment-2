// src/components/ImageUpload.js
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
const ImageUpload = ({ onImageSelected }) => {
    const [webcamOpen, setWebcamOpen] = useState(false);
    const webcamRef = useRef(null);
  
    const captureImage = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      onImageSelected(imageSrc);
      setWebcamOpen(false);
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImageSelected(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div className="flex flex-col items-center gap-4">
        {webcamOpen ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-64 h-48 rounded-lg border-2 border-gray-300"
            />
            <button onClick={captureImage} className="bg-blue-500 text-white px-4 py-2 rounded">
              Capture Photo
            </button>
            <button onClick={() => setWebcamOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </>
        ) : (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-gray-700" />
            <button onClick={() => setWebcamOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">
              Open Camera
            </button>
          </>
        )}
      </div>
    );
}

export default ImageUpload
