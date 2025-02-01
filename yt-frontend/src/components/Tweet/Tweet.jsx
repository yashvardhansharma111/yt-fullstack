import React, { useState } from "react";
import { timeAgo } from "../../assets/timeAgo";
import { DropDown, Like } from "../index.js";
import { useDeleteTweet, useEditTweet } from "../../hooks/tweet.hook.js";
import { useSelector } from "react-redux";

function Tweet({ tweet, isOwner }) {
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet?.content);

  const { mutateAsync: deleteTweet } = useDeleteTweet();
  const handleDelete = async () => {
    await deleteTweet(tweet?._id);
  };

  const handleTweetChange = (e) => {
    setEditedTweet(e.target.value);
  };

  const { mutateAsync: editTweet } = useEditTweet();
  const handleEdit = async () => {
    if (editedTweet.trim() === tweet?.content.trim()) {
      setIsEditing(false);
      return;
    }

    const res = await editTweet({
      tweetId: tweet._id,
      tweet: editedTweet,
    });
    if (res) {
      setIsEditing(false);
    }
  };

  return (
    <div className="py-4 flex flex-col md:flex-row justify-between items-start border-b border-gray-300 dark:border-gray-700 space-y-3 md:space-y-0">
      {/* Tweet Owner and Time */}
      <div className="flex items-start gap-3 w-full">
        <div className="h-14 w-14">
          <img
            src={tweet?.ownerDetails?.avatar?.url}
            alt={tweet?.ownerDetails?.username}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-black dark:text-white">
              {tweet?.ownerDetails?.username}
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {timeAgo(tweet?.createdAt)}
            </span>
          </div>

          {/* Editable Tweet Content */}
          {isEditing ? (
            <div className="flex items-center gap-4 mt-2">
              <textarea
                className="w-full p-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-200 border rounded-lg border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring focus:ring-orange-300 dark:focus:ring-orange-500 focus:outline-none transition-all duration-200"
                value={editedTweet}
                onChange={handleTweetChange}
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-white bg-gray-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 text-sm text-white bg-orange-500 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-black dark:text-gray-200">{tweet?.content}</p>
          )}
        </div>
      </div>

      {/* Actions (Delete, Edit, Like) */}
      <div className="flex items-center gap-3">
        {authStatus && isOwner && (
          <DropDown
            handleDelete={handleDelete}
            handleEdit={() => setIsEditing(true)}
          />
        )}
        <Like
          id={tweet?._id}
          isLiked={tweet?.isLiked}
          likesCount={tweet?.likesCount}
          type={"tweets"}
        />
      </div>
    </div>
  );
}

export default Tweet;
