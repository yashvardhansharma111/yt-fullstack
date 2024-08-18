import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // Get user from req.user?._id
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Get channel stats
    const channelStats = await User.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(req.user?._id) },
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "Totalvideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "likes",
                            localField: "_id",
                            foreignField: "video",
                            as: "Videolikes",
                        },
                    },
                    {
                        $lookup: {
                            from: "comments",
                            localField: "_id",
                            foreignField: "video",
                            as: "TotalComments",
                        },
                    },
                    {
                        $addFields: {
                            Videolikes: { $size: "$Videolikes" },
                            TotalComments: { $size: "$TotalComments" },
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "Subscribers",
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "SubscribedTo",
            },
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullname: 1,
                avatar: 1,
                totalViews: { $sum: "$Totalvideos.views" },
                totalVideos: { $size: "$Totalvideos" },
                totalComments: { $sum: "$Totalvideos.TotalComments" },
                totalLikes: { $sum: "$Totalvideos.Videolikes" },
                totalSubscribers: { $size: "$Subscribers" },
                totalSubscribedTo: { $size: "$SubscribedTo" },
            },
        },
    ]);

    if (!channelStats) {
        throw new ApiError(500, "Some internal error occurred");
    }

    return res
    .status(200)
    .json(
    new ApiResponse
    (200, 
    channelStats[0],
     "Channel Stats"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    try {
        // Ensure user is authenticated and retrieve user ID
        const userId = req.user._id;

        // Extract pagination parameters
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const videoLimit = parseInt(limit, 10);

        // Query videos uploaded by the logged-in user
        const videos = await Video.find({ owner: userId })
            .skip(skip)
            .limit(videoLimit)
            .sort({ createdAt: -1 });

        // Count total videos uploaded by the user
        const totalVideos = await Video.countDocuments({ owner: userId });

        // Calculate total pages
        const totalPages = Math.ceil(totalVideos / limit);

        // Prepare and send the response
        return res
        .status(200)
        .json({
            success: true,
            data: {
                videos,
                totalPages,
                currentPage: parseInt(page, 10),
            },
        });
    } catch (error) {
        console.error("Error fetching channel videos:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch channel videos",
        });
    }
});

export {
    getChannelStats, 
    getChannelVideos
    }