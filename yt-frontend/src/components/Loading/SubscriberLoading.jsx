import React from "react";

function SubscriberLoading() {
  return (
    <div className="flex w-full justify-between bg-white dark:bg-black text-black dark:text-white">
      <div className="flex items-center gap-x-2">
        <div className="h-14 w-14 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="block">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="mt-2 h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="block">
        <div className="h-10 w-24 bg-orange-500 dark:bg-orange-600 rounded"></div>
      </div>
    </div>
  );
}

export default SubscriberLoading;
