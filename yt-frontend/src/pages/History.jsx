import React, { useState } from "react";
import { useClearWatchHistory, useWatchHistory } from "../hooks/user.hook";
import { VideolistCard, VideolistCardLoading } from "../components/index";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { FaHistory } from "react-icons/fa"; // Emoji Icon for History

function History() {
  const { data: watchHistory, isLoading } = useWatchHistory();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = watchHistory?.filter((video) =>
    video.video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { mutateAsync: clearUserWatchHistory } = useClearWatchHistory();
  const clearWatchHistory = async () => {
    await clearUserWatchHistory();
  };

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

  return (
    <div className="flex flex-col sm:flex-row w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 bg-white dark:bg-[#121212] transition-colors duration-300">
      <section className="w-full sm:w-3/4 pr-4">
        <h1 className="text-3xl font-bold my-2 ml-4 dark:text-white text-gray-800 flex items-center">
          <FaHistory className="mr-2 text-orange-500" /> History{" "}
          <span role="img" aria-label="history" className="ml-2 text-xl">
            🕒
          </span>
        </h1>

        <div className="flex flex-col gap-4 p-4">
          {filteredHistory &&
            filteredHistory.map((video) => (
              <Link to={`/video/${video?.video?._id}`} key={video?.video?._id}>
                <VideolistCard video={video.video} />
              </Link>
            ))}
        </div>
      </section>

      <aside className="w-full sm:w-1/4 p-4 bg-white dark:bg-[#1c1c1c] rounded-lg shadow-md">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search your history"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 dark:text-white text-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-300"
          />
          <BiSearch className="absolute h-6 w-6 left-3 top-2.5 text-gray-400 dark:text-gray-500" />
        </div>

        <button
          onClick={clearWatchHistory}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <span className="mr-2">🧹</span> Clear Watch History
        </button>
      </aside>
    </div>
  );
}

export default History;
