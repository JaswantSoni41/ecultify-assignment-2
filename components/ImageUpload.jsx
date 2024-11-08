// src/components/ImageUpload.js
import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { FaCamera } from "react-icons/fa";
import { RiImageAddLine } from "react-icons/ri";
import { TbCapture } from "react-icons/tb";
import { MdOutlineCancel } from "react-icons/md";
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
      <div className="flex flex-col items-center justify-center w-ful">
        {webcamOpen ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-64 h-48 rounded-lg border-2 border-gray-300 mb-5"
            />
            <div className="flex flex-col md:flex-row justify-center items-center gap-2">
            <button onClick={captureImage} className="bg-blue-500 text-white px-4 py-2 rounded-full inline-flex justify-center items-center gap-1 text-3xl">
            <TbCapture /> <span className='hidden md:inline-block text-xl'>Capture</span>
            </button>
            <button onClick={() => setWebcamOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded-full flex justify-center items-center gap-1 text-3xl">
            <MdOutlineCancel /><span className='hidden md:block text-xl'>Cancel</span>
            </button>
            </div>
          </>
        ) : (
          <>
          <div className='flex justify-center items-center gap-8'>
          <input type="file" name='file' id='file' accept="image/*" onChange={handleFileChange} className="text-gray-700 hidden" />
            <label htmlFor="file" className='cursor-pointer bg-green-500 text-white p-4 rounded-full flex justify-center items-center gap-1 text-4xl'><RiImageAddLine /><span className='hidden md:block text-xl'>Choose File</span></label>
            <button onClick={() => setWebcamOpen(true)} className="bg-green-500 text-white p-4 rounded-full text-4xl flex justify-center items-center gap-1">
            <FaCamera /><span className='hidden md:block text-xl'>Open Camera</span>
            </button>
          </div>
            
          </>
        )}
      </div>
    );
}

export default ImageUpload
