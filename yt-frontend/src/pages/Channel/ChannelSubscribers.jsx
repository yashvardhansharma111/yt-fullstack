import React, { useMemo, useState } from "react";
import { useChannelSubcribers } from "../../hooks/subscription.hook";
import { useSelector } from "react-redux";
import { SubscriberLoading } from "../../components/index.js";
import { FaUser, FaSearch } from "react-icons/fa";

function ChannelSubscribers() {
  const channelId = useSelector((state) => state.channel.channel?._id);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: channelSubscribers, isLoading } = useChannelSubcribers(channelId);

  const filteredSubscribers = useMemo(() => {
    return channelSubscribers?.filter((subscriber) =>
      subscriber.subscriber?.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [channelSubscribers, searchTerm]);

  if (isLoading)
    return (
      <div className="flex flex-col gap-y-4 p-6 bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg">
        {Array(5)
          .fill()
          .map((_, index) => (
            <SubscriberLoading key={index} />
          ))}
      </div>
    );

  if (channelSubscribers && channelSubscribers.length === 0) {
    return (
      <div className="flex justify-center p-8 bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-200">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex justify-center">
            <FaUser className="text-6xl text-amber-600 dark:text-amber-400" />
          </div>
          <h5 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
            No Subscribers Yet
          </h5>
          <p className="text-gray-600 dark:text-gray-400">
            This channel hasn't received any subscribers. Share your content to grow your audience!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 p-6 bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-200">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <FaSearch className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <input
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 rounded-lg 
                     text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
                     border border-amber-200 dark:border-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400
                     transition-colors duration-200"
          placeholder="Search subscribers..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Subscribers List */}
      <div className="space-y-3">
        {filteredSubscribers && filteredSubscribers.length > 0 ? (
          filteredSubscribers.map((subscriber) => (
            <div
              key={subscriber.subscriber?._id}
              className="flex items-center gap-x-3 p-4 bg-white dark:bg-gray-700 
                         rounded-lg shadow-sm hover:shadow-md
                         transition-all duration-200"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-gray-600 rounded-full 
                            flex items-center justify-center">
                {subscriber.subscriber?.avatar ? (
                  <img
                    src={subscriber.subscriber.avatar}
                    alt={subscriber.subscriber.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="text-amber-600 dark:text-amber-400 text-xl" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-gray-900 dark:text-white font-medium truncate">
                  {subscriber.subscriber?.username}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                  {subscriber.subscriber?.email}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No subscribers found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelSubscribers;