import React from "react";
import { useVideos } from "../../hooks/video.hook";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { VideoCardLoading, Videocard } from "../../components/index";
import { FaVideoSlash } from "react-icons/fa"; // Import an icon for empty state

function ChannelVideos() {
  const channelId = useSelector((state) => state.channel.channel?._id);

  const {
    data: channelVideos,
    isFetching,
    isFetched,
  } = useVideos({ userId: channelId });

  if (isFetching) {
    return (
      <div className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
          {Array(8)
            .fill()
            .map((_, index) => (
              <VideoCardLoading key={index} />
            ))}
        </div>
      </div>
    );
  }

  if (channelVideos?.pages[0]?.totalDocs === 0) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <FaVideoSlash className="mb-3 text-orange-500 dark:text-orange-300 text-5xl" />
          <h5 className="mb-2 font-semibold text-gray-900 dark:text-white">
            No videos uploaded
          </h5>
          <p className="text-gray-500 dark:text-gray-400">
            This channel has not uploaded any videos yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4 ${
        channelVideos?.pages?.[0]?.docs.length === 1
          ? "justify-items-start"
          : ""
      }`}
    >
      {isFetched &&
        channelVideos?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.docs.map((video) => (
              <Link to={`/video/${video._id}`} key={video._id}>
                <Videocard video={video} />
              </Link>
            ))}
          </React.Fragment>
        ))}
    </div>
  );
}

export default ChannelVideos;
