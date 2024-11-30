import React from "react";
import SubscribeButton from "../components/Buttons/SubscribeButton";

function Subscriber({ subscriber }) {
  return (
    <div className="flex w-full justify-between">
      <div className="flex items-center gap-x-2">
        <div className="h-14 w-14 shrink-0">
          <img
            src={subscriber?.avatar?.url}
            alt={subscriber?.username}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="block">
          <h6 className="font-semibold text-gray-900 dark:text-gray-100">
            {subscriber?.fullName}
          </h6>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {subscriber?.subscribersCount} Subscribers
          </p>
        </div>
      </div>
      <div className="block">
        <SubscribeButton
          isSubscribed={subscriber?.subscribedToSubscriber}
          channelId={subscriber._id}
        />
      </div>
    </div>
  );
}

export default Subscriber;
