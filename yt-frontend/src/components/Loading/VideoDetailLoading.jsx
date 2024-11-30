import React from "react";

const VideoDetailLoading = () => {
  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-black text-black dark:text-white">
      {/* Main content */}
      <div className="w-full lg:w-3/4 p-4">
        {/* Video player skeleton */}
        <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>

        {/* Video controls skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Description skeleton */}
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/4 p-4">
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
      </div>
    </div>
  );
};

export default VideoDetailLoading;
