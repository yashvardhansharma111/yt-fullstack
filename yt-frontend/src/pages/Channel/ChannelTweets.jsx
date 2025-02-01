import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { Like, Tweet, TweetInput, SubscriberLoading } from "../../components";
import { useChannelTweets } from "../../hooks/tweet.hook";
import { FaCommentDots } from "react-icons/fa";

function ChannelTweets() {
  const channelId = useSelector((state) => state.channel.channel?._id);
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const isOwner = channelId === currentUserId;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isFetched,
  } = useChannelTweets(channelId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  const allTweets = data?.pages.flatMap((page) => page.docs) || [];

  if (isFetched && allTweets.length === 0) {
    return (
      <div className="space-y-6 transition-all duration-200">
        {isOwner && (
          <div className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <TweetInput />
          </div>
        )}
        
        <div className="flex justify-center p-8 bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="w-full max-w-sm text-center">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex rounded-full bg-amber-200 dark:bg-amber-900 p-4">
                <FaCommentDots className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </span>
            </div>
            <h5 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              No Tweets Yet
            </h5>
            <p className="text-gray-600 dark:text-gray-400">
              This channel has yet to <strong>share</strong> any tweets. 
              {isOwner && " Start the conversation by creating your first tweet!"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <TweetInput />
        </div>
      )}
      
      <div className="space-y-4">
        {allTweets.map((tweet) => (
          <div key={tweet._id} className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <Tweet isOwner={isOwner} tweet={tweet} />
          </div>
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="space-y-4">
          {Array(3)
            .fill()
            .map((_, index) => (
              <div key={index} className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <SubscriberLoading />
              </div>
            ))}
        </div>
      )}
      
      <div ref={ref} className="h-4" />
    </div>
  );
}

export default ChannelTweets;