import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import {
  Like,
  TweetInput,
  Tweet,
  SubscriberLoading,
  DropDown,
} from "../components/index";
import { useAllTweets } from "../hooks/tweet.hook";

function TweetPage() {
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const authStatus = useSelector((state) => state.auth.authStatus);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isFetched,
    isRefetching,
  } = useAllTweets(authStatus);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allTweets = data?.pages.flatMap((page) => page.docs) || [];

  return (
    <section className="w-full bg-white pb-[70px] dark:bg-black sm:ml-[70px] sm:pb-0 lg:ml-0">
      <h1 className="text-3xl text-black font-semibold text--900 dark:text-white my-2 ml-4">
        Tweets
      </h1>

      {/* Tweet Input Section */}
      <div className="px-4">
        <TweetInput />
      </div>

      {/* Tweets List */}
      <div className="flex flex-col gap-6 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        {isFetching && !isFetchingNextPage && !isRefetching ? (
          <div className="flex flex-col justify-center gap-3">
            {Array(5)
              .fill()
              .map((_, index) => (
                <SubscriberLoading key={index} />
              ))}
          </div>
        ) : (
          allTweets.map((tweet) => (
            <React.Fragment key={tweet?._id}>
              <Tweet
                tweet={tweet}
                isOwner={tweet?.ownerDetails?._id === currentUserId}
              />
            </React.Fragment>
          ))
        )}

        {/* Loading State for Next Tweets */}
        {isFetchingNextPage && (
          <div className="flex flex-col justify-center gap-3 mt-4">
            {Array(3)
              .fill()
              .map((_, index) => (
                <SubscriberLoading key={index} />
              ))}
          </div>
        )}

        {/* Scroll-triggered loading */}
        <div ref={ref}></div>
      </div>
    </section>
  );
}

export default TweetPage;
