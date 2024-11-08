const LoadingIndicator = () => {
    return (
        <div className="flex justify-center items-center mt-6">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-blue-500">Processing...</p>
        </div>
      );
}

export default LoadingIndicator

  