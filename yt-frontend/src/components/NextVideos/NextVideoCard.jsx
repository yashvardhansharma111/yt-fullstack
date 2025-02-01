import React from "react";
import { formatDuration, timeAgo } from "../../assets/timeAgo";

function NextVideoCard({ video, owner }) {
  return (
    <div className="w-full gap-x-2 border dark:border-gray-700 border-gray-300 pr-2 md:flex dark:bg-gray-900 bg-white">
      <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
        <div className="w-full pt-[56%] relative">
          <img
            src={video?.thumbnail?.url}
            alt={video?.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm text-white">
            {formatDuration(video?.duration)}
          </span>
        </div>
      </div>
      <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
        <div className="h-12 w-12 shrink-0 md:hidden">
          <img
            src={video?.ownerDetails?.avatar?.url || owner?.avatar?.url}
            alt={video?.ownerDetails?.username || owner?.username}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="w-full pt-1 md:pt-0">
          <h6 className="mb-1 text-sm font-semibold dark:text-white text-gray-900">
            {video?.title}
          </h6>
          <p className="mb-0.5 mt-2 text-sm dark:text-gray-400 text-gray-600">
            {video?.ownerDetails?.username || owner?.username}
          </p>
          <p className="flex text-sm dark:text-gray-400 text-gray-600">
            {video?.views} Views · {timeAgo(video?.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NextVideoCard;
