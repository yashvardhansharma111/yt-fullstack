import React, { useEffect, useState } from "react";
import { Comment, Input, LoginPopup, SpButton } from "../index.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useInView } from "react-intersection-observer";
import { useComments, useAddComment } from "../../hooks/comment.hook.js";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";

// Schema for form validation
const schema = z.object({
  comment: z.string().min(1, "Comment cannot be empty"),
});

function CommentBox({ videoId }) {
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    data: comments,
    fetchNextPage,
    isFetched,
    isFetching,
  } = useComments(videoId, authStatus);
  const { ref, inView } = useInView();

  // Fetch more comments when the user scrolls to the bottom
  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  const { mutateAsync: addComment } = useAddComment();

  // Handle comment submission
  const handleAddComment = async (data) => {
    if (!authStatus) return setShowLoginPopup(true);
    const res = await addComment({ videoId, comment: data.comment });
    if (res) reset(); // Reset form after submission
  };

  const totalComments = comments?.pages[0]?.totalDocs || 0;

  // Login popup for unauthenticated users
  if (showLoginPopup)
    return (
      <LoginPopup
        loginTo={"Add a Comment"}
        onClose={() => setShowLoginPopup(false)}
      />
    );

  return (
    <div className="w-full">
      {/* Toggle comments button on mobile */}
      <button
        className="w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden dark:border-gray-600 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h6 className="font-semibold text-gray-800 dark:text-white">{totalComments} Comments</h6>
      </button>

      {/* Comment section, toggles on mobile */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] h-[calc(100%-69px)] overflow-auto rounded-t-lg border bg-white dark:bg-gray-900 p-4 transition-transform duration-300 sm:static sm:h-auto sm:max-h-[500px] sm:transform-none lg:max-h-none dark:border-gray-600 ${
          isOpen ? "translate-y-0" : "translate-y-full sm:translate-y-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h6 className="font-semibold text-gray-800 dark:text-white">{totalComments} Comments</h6>
          <button
            className="sm:hidden p-2 rounded-full hover:bg-white/10 text-gray-800 dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Comment Form */}
        <form
          onSubmit={handleSubmit(handleAddComment)}
          className="w-full flex items-center justify-center gap-3 mb-4"
        >
          <Input
            type="text"
            placeholder="Add a Comment"
            id="comment"
            className={`w-full rounded-lg border bg-transparent px-3 py-2 placeholder-gray-500 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-orange-500 ${
              errors.comment ? "border-red-500" : ""
            }`}
            {...register("comment", { required: true })}
          />
          {errors.comment && (
            <p className="text-red-500 text-sm">{errors.comment.message}</p>
          )}
          <SpButton type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
            Send
          </SpButton>
        </form>

        <hr className="my-4 border-gray-200 dark:border-gray-700" />

        {/* Comments List */}
        <div>
          {isFetching ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading comments...</p>
          ) : (
            isFetched &&
            comments?.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.docs.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
              </React.Fragment>
            ))
          )}
          <div ref={ref}></div>
        </div>
      </div>
    </div>
  );
}

export default CommentBox;
