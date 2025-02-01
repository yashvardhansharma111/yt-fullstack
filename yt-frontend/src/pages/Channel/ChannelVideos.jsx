import React from "react";
import { useVideos } from "../../hooks/video.hook";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { VideoCardLoading, Videocard } from "../../components/index";
import { FaVideoSlash } from "react-icons/fa";

function ChannelVideos() {
  const channelId = useSelector((state) => state.channel.channel?._id);

  const {
    data: channelVideos,
    isFetching,
    isFetched,
  } = useVideos({ userId: channelId });

  if (isFetching) {
    return (
      <div className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8)
            .fill()
            .map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                <VideoCardLoading />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (channelVideos?.pages[0]?.totalDocs === 0) {
    return (
      <div className="flex justify-center p-8 bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="w-full max-w-sm text-center">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex rounded-full bg-amber-200 dark:bg-amber-900 p-4">
              <FaVideoSlash className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </span>
          </div>
          <h5 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            No Videos Yet
          </h5>
          <p className="text-gray-600 dark:text-gray-400">
            This channel hasn't uploaded any videos yet. 
            Check back later for new content!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
          ${channelVideos?.pages?.[0]?.docs.length === 1 ? "justify-items-start" : ""}`}
      >
        {isFetched &&
          channelVideos?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.docs.map((video) => (
                <Link 
                  to={`/video/${video._id}`} 
                  key={video._id}
                  className="block w-full transform transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="h-full bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                    <Videocard video={video} />
                  </div>
                </Link>
              ))}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}

export default ChannelVideos;