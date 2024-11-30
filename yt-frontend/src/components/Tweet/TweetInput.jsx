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
        className="w-full p-2 bg-white text-black border rounded-lg border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring focus:ring-orange-300 dark:focus:ring-orange-500 focus:outline-none"
        value={tweet}
        onChange={(e) => setTweet(e.target.value)}
      ></textarea>
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={sendTweet}
      >
        {isPending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default TweetInput;
