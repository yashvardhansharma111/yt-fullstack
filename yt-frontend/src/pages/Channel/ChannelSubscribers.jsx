import React, { useMemo, useState } from "react";
import { useChannelSubcribers } from "../../hooks/subscription.hook";
import { useSelector } from "react-redux";
import { SubscriberLoading } from "../../components/index.js";
import { FaUser } from "react-icons/fa"; // Import an icon for better empty state

function ChannelSubscribers() {
  const channelId = useSelector((state) => state.channel.channel?._id);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: channelSubscribers, isLoading } =
    useChannelSubcribers(channelId);

  const filteredSubscribers = useMemo(() => {
    return channelSubscribers?.filter((subscriber) =>
      subscriber.subscriber?.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [channelSubscribers, searchTerm]);

  if (isLoading)
    return (
      <div className="flex flex-col gap-y-4 py-4">
        {Array(5)
          .fill()
          .map((_, index) => (
            <SubscriberLoading key={index} />
          ))}
      </div>
    );

  if (channelSubscribers && channelSubscribers.length === 0) {
    return (
      <div className="flex justify-center p-4 mt-4">
        <div className="w-full max-w-sm text-center">
          <FaUser className="mb-3 w-full text-orange-500 dark:text-orange-300 text-5xl" />
          <h5 className="mb-2 font-semibold text-gray-900 dark:text-white">
            No Subscribers
          </h5>
          <p className="text-gray-500 dark:text-gray-400">
            This channel has currently no Subscribers
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 py-4">
      {/* Search Bar */}
      <div className="relative mb-2 rounded-lg bg-white dark:bg-gray-800 py-2 pl-8 pr-3 text-black dark:text-white shadow-sm">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            ></path>
          </svg>
        </span>
        <input
          className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-300"
          placeholder="Search subscribers"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Subscribers List */}
      {filteredSubscribers &&
        filteredSubscribers.map((subscriber) => (
          <Subscriber
            key={subscriber.subscriber?._id}
            subscriber={subscriber.subscriber}
          />
        ))}
    </div>
  );
}

export default ChannelSubscribers;
