"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../components/ImageUpload";
import LoadingIndicator from "../components/LoadingIndicator";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { RiAiGenerate } from "react-icons/ri";
import { FaDownload } from "react-icons/fa6";

export default function Home() {
  const [image, setImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const ffmpeg = createFFmpeg({ log: true });

  const handleGenerateVideo = async () => {
    if (!image) return;

    setLoading(true);
    setGifUrl(""); // Clear previous GIF

    try {
      const response = await fetch("/api/generate-gif", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_base64: image.split(",")[1] }),
      });

      if (!response.ok) throw new Error("Failed to generate video");
      
      const result = await response.json();
      setVideoUrl(result.videoUrl); // Set video URL for display
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToGif = async () => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    if (!videoUrl) return;

    setLoading(true);

    try {
      const videoData = await fetch(videoUrl).then((res) => res.arrayBuffer());
      ffmpeg.FS("writeFile", "video.mp4", new Uint8Array(videoData));

      // Run ffmpeg command to convert video to gif
      await ffmpeg.run(
        "-i",
        "video.mp4",
        "-vf",
        "fps=50,scale=320:-1",
        "output.gif"
      );

      const gifData = ffmpeg.FS("readFile", "output.gif");
      const gifBlob = new Blob([gifData.buffer], { type: "image/gif" });
      const gifUrl = URL.createObjectURL(gifBlob);

      setGifUrl(gifUrl);
    } catch (error) {
      console.error("Error converting video to GIF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadGif = () => {
    if (!gifUrl) return; // If GIF hasn't been generated, exit

    const link = document.createElement("a");
    link.href = gifUrl;
    link.download = "img-to-gif-output.gif";
    link.click();
  };

  useEffect(() => {
    if (videoUrl && !gifUrl) {
      handleConvertToGif(); // Automatically generate GIF when videoUrl is available
    }
  }, [videoUrl, gifUrl]);

  return (
    <div className="h-fit min-w-[320px] max-w-[500px] flex flex-col items-center justify-center bg-white shadow-2xl p-10 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Real-Time GIF Generator
      </h1>

      <p className="text-black text-xl mb-3 text-center">
        Choose Image by Clicking add image or Click a photo
      </p>
      <ImageUpload onImageSelected={setImage} />

      <div className="flex flex-col md:flex-row justify-center items-center w-full h-full gap-2">
        <div className="flex flex-col justify-center items-center">
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-64 h-auto my-4 border border-gray-300 rounded-lg"
            />
          )}
          <button
            disabled={!image}
            onClick={handleGenerateVideo}
            className="bg-indigo-500 text-white mt-4 p-4 rounded-full text-3xl flex justify-center items-center gap-1"
          >
            <RiAiGenerate />
            <span className="hidden md:flex text-xl">Generate GIF</span>
          </button>
        </div>

        {loading && <LoadingIndicator />}

        <div className="flex flex-col items-center justify-center">
          {gifUrl && (
            <img
              src={gifUrl}
              alt="Generated GIF"
              className="w-64 h-auto rounded-lg shadow-lg my-4"
            />
          )}

          {videoUrl && (
            <button
              disabled={loading || !gifUrl}
              onClick={handleDownloadGif}
              className="bg-purple-600 text-white mt-4 p-4 rounded-full text-3xl flex justify-center items-center gap-2"
            >
              <FaDownload />
              <span className="hidden md:block text-xl">Download GIF</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
