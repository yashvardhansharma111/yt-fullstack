import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { useLike } from "../../hooks/like.hook";
import { useSelector } from "react-redux";
import LoginPopup from "../LoginPopup";

function Like({ id, isLiked, likesCount, type, className, iconSize }) {
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likesCountState, setLikesCountState] = useState(likesCount);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    setIsLikedState(isLiked);
    setLikesCountState(likesCount);
  }, [isLiked, likesCount]);

  const { mutateAsync: like } = useLike(
    type === "comments" ? "comment" : type === "videos" ? "video" : "tweet"
  );

  const handleLike = async () => {
    if (!authStatus) {
      return setShowLoginPopup(true);
    }

    await like(id);

    setIsLikedState((prev) => !prev);
    setLikesCountState((prev) => (isLikedState ? prev - 1 : prev + 1));
  };

  if (showLoginPopup)
    return (
      <LoginPopup
        loginTo={`Like ${type}`}
        onClose={() => setShowLoginPopup(false)}
      />
    );

  return (
    <div className={`flex justify-center items-center rounded-lg dark:border-gray-600`}>
      <IconContext.Provider value={{ className: `${iconSize}` }}>
        <button
          onClick={handleLike}
          className={`flex justify-center items-center gap-x-1 py-1.5 px-3 rounded-md transition-all duration-200 hover:opacity-80 focus:outline-none ${className} 
          ${
            isLikedState
              ? "bg-orange-500 text-white dark:bg-orange-700 dark:text-white"
              : "bg-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <span className="inline-block">
            {isLikedState ? (
              <FaThumbsUp className="text-white" />
            ) : (
              <FaRegThumbsUp className="text-gray-500 dark:text-gray-300" />
            )}
          </span>
          <span className="text-md text-gray-400 dark:text-gray-300">
            {likesCountState}
          </span>
        </button>
      </IconContext.Provider>
    </div>
  );
}

export default Like;
