import React, { useState } from "react";
import { timeAgo } from "../../assets/timeAgo";
import Like from "./Like";
import { useDeleteComment, useEditComment } from "../../hooks/comment.hook";
import { useSelector } from "react-redux";
import DropDown from "../DropDown";
import { Link } from "react-router-dom";

function Comment({ comment }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment?.content);
  const userId = useSelector((state) => state.auth.user?._id);
  const isOwner = comment?.owner?._id === userId;
  const { mutateAsync: editComment } = useEditComment();
  const { mutateAsync: deleteComment } = useDeleteComment();

  const handleCommentChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleEditComment = async () => {
    if (editedComment.trim() === comment?.content.trim()) {
      setIsEditing(false);
      return;
    }
    const data = await editComment({
      commentId: comment._id,
      comment: editedComment,
    });
    if (data) {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = async () => {
    const data = await deleteComment(comment?._id);
    if (data) setIsMenuOpen(false);
  };

  return (
    <>
      <div className="flex justify-between gap-x-4">
        <div className="flex gap-x-4">
          <Link to={`/channel/${comment?.owner?.username}`}>
            <div className="mt-2 h-11 w-11 shrink-0">
              <img
                src={comment?.owner?.avatar?.url}
                alt={comment?.owner?.username}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </Link>
          <div className="block">
            <p className="flex items-center text-gray-900 dark:text-white">
              {comment?.owner?.fullName}  ·  <span className="text-sm">{timeAgo(comment?.createdAt)}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{comment?.owner?.username}
            </p>

            {isEditing ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  className="w-full mt-3 p-2 text-black dark:text-white bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  value={editedComment}
                  onChange={handleCommentChange}
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="mt-3 px-4 py-2 text-sm text-white bg-gray-500 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditComment}
                  className="mt-3 px-4 py-2 text-sm text-white bg-blue-500 rounded-md"
                >
                  Save
                </button>
              </div>
            ) : (
              <p className="mt-3 text-gray-900 dark:text-white">{comment?.content}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <DropDown isOwner={isOwner} handleEdit={() => setIsEditing(true)} handleDelete={handleDeleteComment} />
          <Like comment={comment} />
        </div>
      </div>
    </>
  );
}

export default Comment;
