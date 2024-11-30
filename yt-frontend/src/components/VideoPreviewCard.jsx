import React from "react";
import { BsCardImage } from "react-icons/bs";

export default function VideoPreviewCard({
  video,
  thumbnail,
  title,
  description,
  name,
}) {
  const thumbnailSrc =
    thumbnail instanceof File ? URL.createObjectURL(thumbnail) : thumbnail;
  const videoSrc = video instanceof File ? URL.createObjectURL(video) : video;

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden text-gray-800 dark:text-white">
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          {thumbnailSrc && videoSrc ? (
            <img
              src={thumbnailSrc}
              alt="thumbnail-videocard"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center">
              <BsCardImage className="w-full h-full text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Please upload both Video and Thumbnail to see Preview
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <h6 className="mb-2 font-semibold text-lg text-gray-800 dark:text-gray-100">
          {title || "Video Title"}
        </h6>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {description && description.length > 250
            ? `${description.substring(0, 250)}...`
            : description || "Video description ........"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          By {name}
        </p>
      </div>
    </div>
  );
}
