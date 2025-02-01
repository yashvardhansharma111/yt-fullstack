import React from "react";
import { useSubscribedChannels } from "../hooks/subscription.hook";
import { useSelector } from "react-redux";
import { ChannelSubscribed, VideolistCard } from "../components";
import { Link } from "react-router-dom";

function Subscriptions() {
  const userId = useSelector((state) => state.auth.user._id);
  const { data: subscriptions } = useSubscribedChannels(userId);
  console.log(subscriptions);

  if (subscriptions && subscriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white text-black dark:bg-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold my-4 text-center text-gray-900 dark:text-white">
          Subscriptions
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400">
          You are not subscribed to any channels.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold my-4 text-center text-orange-700 dark:text-orange-500">
        Subscriptions
      </h1>
      
      {/* Subscribed Channels Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {subscriptions &&
          subscriptions.map((channel) => (
            <Link
              to={`/channel/${channel?.subscribedChannel?.username}`}
              key={channel?.subscribedChannel?._id}
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <ChannelSubscribed channel={channel?.subscribedChannel} />
            </Link>
          ))}
      </div>

      {/* Latest Videos from Subscriptions */}
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-orange-600 dark:text-orange-400">
          Latest Videos from Subscriptions
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subscriptions &&
            subscriptions.map((channel) => (
              <Link
                to={`/video/${channel?.subscribedChannel?.latestVideo?._id}`}
                key={channel?.subscribedChannel._id}
                className="transform transition-transform duration-300 hover:scale-105"
              >
                <VideolistCard
                  video={channel?.subscribedChannel?.latestVideo}
                  owner={{
                    avatar: channel?.subscribedChannel?.avatar,
                    username: channel?.subscribedChannel?.username,
                    fullName: channel?.subscribedChannel?.fullName,
                  }}
                />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Subscriptions;
