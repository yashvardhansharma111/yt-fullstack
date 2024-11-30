import React from "react";

const ProgressBar = () => {
  return (
    <div className="sticky top-0 z-40 w-full h-2 bg-gray-200 dark:bg-gray-800 overflow-hidden">
      <div
        className="absolute h-2 bg-orange-500 dark:bg-orange-400 w-1/4 animate-slide"
        style={{
          animationDuration: "2s",
          animationIterationCount: "infinite",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
