import React from "react";

function NextVideoCardLoading() {
  return (
    <div className="w-full gap-x-2 border dark:border-gray-700 border-gray-300 pr-2 md:flex animate-pulse">
      <div className="relative mb-2 w-full md:mb-0 md:w-5/12">
        <div className="w-full pt-[56%] relative bg-gray-300 dark:bg-gray-700" />
      </div>
      <div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
        <div className="h-12 w-12 shrink-0 md:hidden bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="w-full pt-1 md:pt-0 space-y-2">
          <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="flex space-x-4">
            <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default NextVideoCardLoading;
