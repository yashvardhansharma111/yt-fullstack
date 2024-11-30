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
      <div className="p-6 rounded-lg max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
        <h2 className="text-xl font-semibold text-red-500 dark:text-red-400">Error</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Unable to load channel information. Please try again later.
        </p>
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
    <div className="text-gray-900 dark:text-white p-6 rounded-lg shadow-lg max-w-md bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-orange-500 dark:text-orange-300">About</h2>
      <h1 className="text-3xl font-bold mb-4 text-orange-600 dark:text-orange-400">
        {channel?.fullName}
      </h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        {channelAbout?.description || "No description provided for this channel"}
      </p>
      <div className="space-y-3">
        {channelDetails.map((detail, index) => (
          <div key={index} className="flex items-center">
            <detail.icon className="text-orange-500 dark:text-orange-300 mr-3 text-xl" />
            {detail.link ? (
              <Link
                to={detail.link}
                className="text-orange-600 hover:text-orange-400 transition duration-300 dark:text-orange-400 dark:hover:text-orange-200"
                aria-label={`Visit ${detail.text}`}
              >
                {detail.text}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-gray-300">{detail.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelAbout;
