import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js"
import { User } from "../models/user.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id
    //TODO: toggle like on video

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError (400 , "Invalid video id")
    }

    const video = await Video.findById(videoId);

    // Fetch the video document 
    if (!video) {
        throw new ApiError(404 , "video not found")
    }

    // Check if the user already liked the video
    const userIndex = video.likes.indexOf(userId);

    if (userIndex === -1){
        video.likes.push(userId);
    }
    else {
        video.likes.splice(userIndex , 1);
    }

    await video.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            { totalLikes: video.likes.length },
            userIndex === -1 ? 'Video liked' : 'Video unliked'
        )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id
    //TODO: toggle like on comment

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError (400 , "Invalid comment id")
    }

    const comment = await Comment.findById(commentId);

    // Fetch the comment document 
    if (!comment) {
        throw new ApiError(404 , "Comment not found")
    }

    // Check if the user already liked the comment
    const userIndex = comment.likes.indexOf(userId);

    if (userIndex === -1){
        comment.likes.push(userId);
    }
    else {
        comment.likes.splice(userIndex , 1);
    }

    await comment.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            { totalLikes: comment.likes.length },
            userIndex === -1 ? 'Comment liked' : 'Comment unliked'
        )
    );


});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id
    //TODO: toggle like on tweet

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError (400 , "Invalid tweet id")
    }

    const tweet = await tweet.findById(tweetId);

    // Fetch the tweet document 
    if (!tweet) {
        throw new ApiError(404 , "tweet not found")
    }

    // Check if the user already liked the tweet
    const userIndex = tweet.likes.indexOf(userId);

    if (userIndex === -1){
        tweet.likes.push(userId);
    }
    else {
        tweet.likes.splice(userIndex , 1);
    }

    await tweet.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            { totalLikes: tweet.likes.length },
            userIndex === -1 ? 'Tweet liked' : 'Tweet unliked'
        )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    // Get userId from the request object
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    // Parse page and limit as integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Validate the user
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Get liked video ids with pagination
    const likedVideoIds = await Like.find({ likedBy: userId })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .select('video');

    // Extract video ids
    const videoIds = likedVideoIds.map(like => like.video);

    // Fetch detailed video information
    const likedVideos = await Video.aggregate([
        {
            $match: {
                _id: { $in: videoIds }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$owner", 0] }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: "$thumbnail.url",
                owner: 1
            }
        }
    ]);

    // Calculate total liked videos
    const totalLikedVideos = await Like.countDocuments({ likedBy: userId });

    // Calculate total pages
    const totalPages = Math.ceil(totalLikedVideos / limitNumber);

    // Send the response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                likedVideos,
                totalPages,
                currentPage: pageNumber,
                totalLikedVideos
            },
            "Liked Videos"
        )
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}