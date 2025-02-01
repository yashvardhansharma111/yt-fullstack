import React, { useState } from "react";
import { useAddTweet } from "../../hooks/tweet.hook";
import { useSelector } from "react-redux";
import LoginPopup from "../LoginPopup";

function TweetInput() {
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [tweet, setTweet] = useState("");

  const { mutateAsync: addTweet, isPending } = useAddTweet();

  const sendTweet = async () => {
    if (!authStatus) {
      return setShowLoginPopup(true);
    }
    await addTweet({ tweet });
    setTweet("");
  };

  if (showLoginPopup)
    return (
      <LoginPopup
        loginTo={"write Tweet"}
        onClose={() => setShowLoginPopup(false)}
      />
    );

  return (
    <div className="w-full mt-3">
      <textarea
        className="w-full p-3 bg-white dark:bg-gray-800 text-black dark:text-gray-200 border rounded-lg border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring focus:ring-orange-300 dark:focus:ring-orange-500 focus:outline-none transition-all duration-200"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
        placeholder="What's on your mind? 😊"
        rows={4}  // Increase height to avoid colliding with button
      />
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={sendTweet}
          className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 focus:outline-none ${
            isPending ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isPending || !tweet.trim()}
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default TweetInput;
