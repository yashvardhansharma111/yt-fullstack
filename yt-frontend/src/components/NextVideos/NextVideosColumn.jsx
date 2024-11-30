import React, { useState } from "react";
import AllNextVideos from "./AllNextVideos";
import UserNextVideos from "./UserNextVideos";

function NextVideosColumn({ videoId, name, userId }) {
  const [nextVideosOption, setNextVideosOption] = useState("all");

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setNextVideosOption("all")}
          className={`
            ${nextVideosOption === "all" ? "bg-orange-500 text-white" : "bg-gray-500 dark:bg-gray-800 dark:text-gray-300 text-gray-200"}
            hover:bg-orange-700 dark:hover:bg-orange-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
          All
        </button>
        <button
          onClick={() => setNextVideosOption("user")}
          className={`
            ${nextVideosOption === "user" ? "bg-orange-500 text-white" : "bg-gray-500 dark:bg-gray-800 dark:text-gray-300 text-gray-200"}
            hover:bg-orange-700 dark:hover:bg-orange-600 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
          From {name}
        </button>
      </div>

      {nextVideosOption === "all" ? (
        <AllNextVideos currentVideoId={videoId} />
      ) : (
        <UserNextVideos userId={userId} />
      )}
    </>
  );
}

export default NextVideosColumn;
