import React, { useEffect, useState } from "react";
import { Comment, Input, LoginPopup, SpButton } from "../index.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useInView } from "react-intersection-observer";
import { useComments, useAddComment } from "../../hooks/comment.hook.js";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";

const schema = z.object({
  comment: z.string().min(1),
});

function CommentBox({ videoId }) {
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
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
  } = useComments(videoId, authStatus);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  const { mutateAsync: addComment } = useAddComment();

  const handleAddComment = async (data) => {
    if (!authStatus) return setShowLoginPopup(true);
    const res = await addComment({ videoId, comment: data.comment });
    if (res) reset();
  };

  const totalComments = comments?.pages[0]?.totalDocs || 0;

  if (showLoginPopup)
    return (
      <LoginPopup
        loginTo={"Add a Comment"}
        onClose={() => setShowLoginPopup(false)}
      />
    );

  return (
    <div className="w-full">
      {/* Button to toggle comments on mobile */}
      <button
        className="w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden dark:border-gray-600 dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h6 className="font-semibold">{totalComments} Comments</h6>
      </button>

      <div
        className={`fixed inset-x-0 bottom-0 z-[60] h-[calc(100%-69px)] overflow-auto rounded-t-lg border bg-white dark:bg-gray-900 p-4 transition-transform duration-300 sm:static sm:h-auto sm:max-h-[500px] sm:transform-none lg:max-h-none dark:border-gray-600 ${
          isOpen ? "translate-y-0" : "translate-y-full sm:translate-y-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h6 className="font-semibold dark:text-white">{totalComments} Comments</h6>
          <button
            className="sm:hidden p-2 rounded-full hover:bg-white/10 dark:text-white"
            onClick={() => setIsOpen(false)}
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Comment Form */}
        <div className="block">
          <form
            onSubmit={handleSubmit(handleAddComment)}
            className="w-full flex items-center justify-center gap-3"
          >
            <Input
              type="text"
              placeholder="Add a Comment"
              id="comment"
              className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white dark:border-gray-600 dark:text-white"
              {...register("comment", { required: true })}
            />
            <SpButton type="submit">Send</SpButton>
          </form>
        </div>

        <hr className="my-4 border-gray-200 dark:border-gray-700" />

        {/* Comments List */}
        <div>
          {isFetched &&
            comments?.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.docs.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
              </React.Fragment>
            ))}
          <div ref={ref}></div>
        </div>
      </div>
    </div>
  );
}

export default CommentBox;
