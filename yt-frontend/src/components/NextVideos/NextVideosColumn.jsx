import React, { useState } from "react";
import AllNextVideos from "./AllNextVideos";
import UserNextVideos from "./UserNextVideos";

function NextVideosColumn({ videoId, name, userId }) {
  const [nextVideosOption, setNextVideosOption] = useState("all");

  return (
    <>
      <div className="flex gap-3">
        {/* "All" Button */}
        <button
          onClick={() => setNextVideosOption("all")}
          className={`
            ${nextVideosOption === "all" ? "bg-orange-600 text-white" : "bg-gray-600 dark:bg-gray-700 text-gray-300"}
            hover:bg-orange-700 hover:text-white dark:hover:bg-orange-500 font-bold py-3 px-5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50`}
        >
          All
        </button>

        {/* "From {name}" Button */}
        <button
          onClick={() => setNextVideosOption("user")}
          className={`
            ${nextVideosOption === "user" ? "bg-orange-600 text-white" : "bg-gray-600 dark:bg-gray-700 text-gray-300"}
            hover:bg-orange-700 hover:text-white dark:hover:bg-orange-500 font-bold py-3 px-5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50`}
        >
          From {name}
        </button>
      </div>

      {/* Display relevant videos based on selection */}
      {nextVideosOption === "all" ? (
        <AllNextVideos currentVideoId={videoId} />
      ) : (
        <UserNextVideos userId={userId} />
      )}
    </>
  );
}

export default NextVideosColumn;
