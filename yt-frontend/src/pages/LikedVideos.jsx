import React from "react";
import { useLikedVideos } from "../hooks/like.hook.js";
import { VideolistCard, VideolistCardLoading } from "../components/index.js";
import { Link } from "react-router-dom";

function LikedVideos() {
  const { data: likedVideos, isLoading, isFetched } = useLikedVideos();

  if (isLoading)
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="flex flex-col gap-4 p-4">
          {Array(5)
            .fill()
            .map((_, index) => (
              <VideolistCardLoading key={index} />
            ))}
        </div>
      </section>
    );

  if (likedVideos.length === 0 && isFetched) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 bg-white dark:bg-[#121212] transition-colors duration-300">
        <h1 className="text-3xl font-bold my-2 ml-4 dark:text-white text-black">
          Liked Videos ❤️
        </h1>
        <div className="ml-4 text-2xl dark:text-gray-300 text-gray-700">
          Your Liked Videos will appear here
        </div>
      </section>
    );
  }

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 bg-white dark:bg-[#121212] transition-colors duration-300">
      <h1 className="text-3xl font-bold my-2 ml-4 dark:text-white text-black">
        Liked Videos ❤️
      </h1>

      <div className="flex flex-col gap-4 p-4">
        {likedVideos &&
          likedVideos.map((video) => (
            <Link
              to={`/video/${video?.likedVideo?._id}`}
              key={video?.likedVideo?._id}
            >
              <VideolistCard
                video={video?.likedVideo}
                key={video?.likedVideo?._id}
              />
            </Link>
          ))}
      </div>
    </section>
  );
}

export default LikedVideos;
