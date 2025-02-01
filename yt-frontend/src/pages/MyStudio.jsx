import React, { useState, useEffect } from "react";
import { TitleInput, DescriptionInput } from "../components/TitleAndDescriptionInput"; // Import your inputs
import { useDispatch, useSelector } from "react-redux";
import { setSideBarFullSize, setShowUploadVideo } from "../features/uiSlice";
import { useChannelStats } from "../hooks/dashboard.hook";
import { VideoStats, UploadVideo, EditVideo } from "../components/index.js";

import { FaRegEye, FaUserFriends, FaHeart } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { CiSquarePlus } from "react-icons/ci";
import { IconContext } from "react-icons";

function MyStudio() {
  const dispatch = useDispatch();
  const channelInfo = useSelector((state) => state.auth.user);
  const showEdit = useSelector((state) => state.ui.showEditVideo);
  const showUpload = useSelector((state) => state.ui.showUploadVideo);
  const videoForEdit = useSelector((state) => state.video.videoForEdit);

  // State for title and description
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(setSideBarFullSize(false));

    return () => {
      dispatch(setSideBarFullSize(true));
    };
  }, [dispatch]);

  const { data: channelStats, isLoading: statsLoading } = useChannelStats();

  const channelStatsItems = [
    {
      icon: <FaRegEye />,
      title: "Total views",
      value: channelStats?.totalViews,
    },
    {
      icon: <FaUserFriends />,
      title: "Total subscribers",
      value: channelStats?.totalSubscribers,
    },
    {
      icon: <FaHeart />,
      title: "Total likes",
      value: channelStats?.totalLikes,
    },
    {
      icon: <BiSolidVideos />,
      title: "Total videos",
      value: channelStats?.totalVideos,
    },
  ];

  const handleUploadVideoClick = () => {
    dispatch(setShowUploadVideo(true));
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-wrap justify-between gap-4">
        <div className="block">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back, {channelInfo?.fullName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Seamless Video Management, Elevated Results.
          </p>
        </div>
        <div className="block">
          <button
            onClick={handleUploadVideoClick}
            className="inline-flex items-center gap-x-2 bg-orange-600 dark:bg-orange-500 px-4 py-2 rounded-md font-semibold text-white dark:text-black transition-all duration-300 hover:bg-orange-500 dark:hover:bg-orange-400"
          >
            <span className="text-xl">📹</span>
            <span className="text-black dark:text-white">Upload video</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
        <IconContext.Provider value={{ className: "text-2xl font-bold" }}>
          {channelStatsItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 shadow-lg dark:shadow-gray-700 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="mb-4 block">
                <span className="h-12 w-12 flex justify-center items-center rounded-full bg-orange-200 dark:bg-orange-700 text-orange-600 dark:text-orange-400 p-2">
                  {item.icon}
                </span>
              </div>
              <h6 className="text-gray-600 dark:text-gray-300">{item.title}</h6>
              <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </IconContext.Provider>
      </div>

      {/* Title and Description Inputs */}
      <div className="mt-6">
        <TitleInput title={title} setTitle={setTitle} />
        <DescriptionInput description={description} setDescription={setDescription} />
      </div>

      {/* Modals for uploading and editing videos */}
      {showUpload && <UploadVideo />}
      {showEdit && videoForEdit && <EditVideo />}

      <VideoStats />
    </div>
  );
}

export default MyStudio;
