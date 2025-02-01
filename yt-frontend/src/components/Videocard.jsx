import React from "react";
import { formatDuration, timeAgo } from "../assets/timeAgo";

function Videocard({ video }) {
  return (
    <div className="w-full p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#1e1e1e]">
      {/* Thumbnail */}
      <div className="relative mb-3 w-full pt-[56%] overflow-hidden rounded-lg bg-gray-200 dark:bg-[#282828]">
        <img
          src={video?.thumbnail?.url}
          alt={video?.title}
          className="absolute inset-0 h-full w-full object-cover rounded-lg"
        />
        {/* Video Duration */}
        <span className="absolute bottom-2 right-2 inline-block rounded-md bg-black bg-opacity-70 px-2 py-1 text-xs font-semibold text-white">
          {formatDuration(video?.duration)}
        </span>
      </div>

      {/* Video Details */}
      <div className="flex gap-x-3">
        {/* Channel Avatar */}
        <div className="h-10 w-10 shrink-0">
          <img
            src={video?.ownerDetails?.avatar?.url}
            alt={video?.ownerDetails?.username}
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        {/* Video Info */}
        <div className="w-full">
          {/* Video Title */}
          <h6 className="mb-1 font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {video?.title}
          </h6>

          {/* Views & Upload Time */}
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {video?.views} Views · {timeAgo(video?.createdAt)}
          </span>

          {/* Channel Name */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {video?.ownerDetails?.username}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Videocard;
