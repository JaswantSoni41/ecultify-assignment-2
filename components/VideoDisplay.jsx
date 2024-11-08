export default function VideoDisplay({ videoUrl }) {
    return (
      <div className="flex flex-col items-center mt-6">
        <video src={videoUrl} controls className="w-64 h-64 rounded-lg shadow-lg" />
      </div>
    );
  }
  