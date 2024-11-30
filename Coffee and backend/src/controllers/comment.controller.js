import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const isGuest = req.query.guest === "true";

    // Validate video ID
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Convert pagination parameters to integers
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    // Check if video exists
    const videoExists = await Video.exists({ _id: videoId });
    if (!videoExists) {
        throw new ApiError(404, "Video not found");
    }

    // Aggregation pipeline to get comments
    const comments = await Comment.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        { $sort: { createdAt: -1 } },
        { $skip: (pageInt - 1) * limitInt },
        { $limit: limitInt },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [{ $project: { _id: 1, username: 1, "avatar.url": 1 } }]
            }
        },
        { $unwind: "$owner" },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" },
                isLiked: {
                    $cond: {
                        if: isGuest,
                        then: false,
                        else: { $in: [req.user?._id, "$likes.likedBy"] }
                    }
                },
            },
        },
    ]);

    const totalComments = await Comment.countDocuments({ video: videoId });

    // Return the comments in the response
    return res.status(200).json(
        new ApiResponse(200, { comments, totalComments }, "Comments fetched successfully")
    );
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
        throw new ApiError(400, "Content is required and can't be empty");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const newComment = new Comment({
        content,
        video: videoId,
        owner: req.user._id,
        createdAt: new Date()
    });

    await newComment.save();

    // Increment comment count on the video
    video.commentCount = (video.commentCount || 0) + 1;
    await video.save();

    return res.status(201).json(new ApiResponse(201, newComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required and cannot be empty");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if the user is the owner of the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.content = content.trim();
    const updatedComment = await comment.save();

    return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Check if the user is the owner of the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    // Decrement comment count on the video
    const video = await Video.findById(comment.video);
    if (video) {
        video.commentCount = Math.max(0, video.commentCount - 1);
        await video.save();
    }

    return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};
