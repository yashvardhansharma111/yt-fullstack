import React from "react";
import {
  FaEnvelope,
  FaGlobe,
  FaVideo,
  FaEye,
  FaTwitter,
  FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useChannelAbouts } from "../../hooks/dashboard.hook";
import { ProgressBar } from "../../components";

const ChannelAbout = () => {
  const channel = useSelector((state) => state.channel.channel);
  const { data: channelAbout, isFetching, isError } = useChannelAbouts();

  if (isFetching) return <ProgressBar />;

  if (isError || !channelAbout) {
    return (
      <div className="w-full p-6">
        <div className="mx-auto rounded-lg bg-orange-50 dark:bg-gray-800 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Error
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Unable to load channel information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const channelDetails = [
    {
      icon: FaEnvelope,
      text: `${channelAbout?.email}`,
      link: `mailto:${channelAbout?.email}`,
    },
    {
      icon: FaGlobe,
      text: `https://shadowplay.vercel.app/channel/${channelAbout?.username}`,
      link: `https://shadowplay.vercel.app/channel/${channelAbout?.username}`,
    },
    { icon: FaVideo, text: `${channelAbout?.totalVideos} Videos` },
    { icon: FaEye, text: `${channelAbout?.totalViews} Views` },
    { icon: FaTwitter, text: `${channelAbout?.totalTweets} Tweets` },
    {
      icon: FaCalendarAlt,
      text: `Joined on ${new Date(channelAbout?.createdAt).toLocaleDateString("en-GB")}`,
    },
  ];

  return (
    <div className="w-full p-6">
      <div className="mx-auto bg-orange-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="border-b border-orange-200 dark:border-gray-700 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-orange-700 dark:text-orange-300 mb-2">
            About
          </h2>
          <h1 className="text-3xl font-bold text-orange-800 dark:text-orange-200">
            {channel?.fullName}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {channelAbout?.description || "No description provided for this channel"}
            </p>
          </div>

          <div className="space-y-4">
            {channelDetails.map((detail, index) => (
              <div
                key={index}
                className="flex items-center p-2 rounded-md hover:bg-orange-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <detail.icon className="text-orange-600 dark:text-orange-400 mr-3 text-xl flex-shrink-0" />
                {detail.link ? (
                  <Link
                    to={detail.link}
                    className="text-orange-700 hover:text-orange-500 dark:text-orange-300 dark:hover:text-orange-200 transition duration-200 break-all"
                    aria-label={`Visit ${detail.text}`}
                  >
                    {detail.text}
                  </Link>
                ) : (
                  <span className="text-gray-600 dark:text-gray-300 break-all">
                    {detail.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelAbout;