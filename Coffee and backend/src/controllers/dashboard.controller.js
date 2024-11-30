import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Aggregate user stats
    const channelStats = await User.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
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

    return res.status(200).json(
        new ApiResponse(200, channelStats[0], "Channel Stats")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Extract pagination parameters
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const videoLimit = parseInt(limit, 10);

        // Query videos uploaded by the logged-in user
        const videos = await Video.aggregate([
            { $match: { owner: userId } },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes",
                },
            },
            {
                $addFields: {
                    likesCount: { $size: "$likes" },
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: videoLimit },
            {
                $project: {
                    _id: 1,
                    "video.url": 1,
                    "thumbnail.url": 1,
                    title: 1,
                    description: 1,
                    isPublished: 1,
                    likesCount: 1,
                    createdAt: 1,
                },
            },
        ]);

        // Count total videos uploaded by the user
        const totalVideos = await Video.countDocuments({ owner: userId });

        // Calculate total pages
        const totalPages = Math.ceil(totalVideos / limit);

        // Prepare and send the response
        return res.status(200).json({
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

const getChannelAbouts = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const channelAbouts = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "videos",
                    localField: "_id",
                    foreignField: "owner",
                    as: "videos",
                },
            },
            {
                $lookup: {
                    from: "tweets",
                    localField: "_id",
                    foreignField: "owner",
                    as: "tweets",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "videos._id",
                    foreignField: "video",
                    as: "videoLikes",
                },
            },
            {
                $project: {
                    username: 1,
                    fullName: 1,
                    email: 1,
                    description: 1,
                    createdAt: 1,
                    totalVideos: { $size: "$videos" },
                    totalTweets: { $size: "$tweets" },
                    totalLikes: { $size: "$videoLikes" },
                    totalViews: { $sum: "$videos.views" },
                },
            },
        ]);

        if (!channelAbouts || channelAbouts.length === 0) {
            throw new ApiError(404, "Channel information not found");
        }

        const channelInfo = channelAbouts[0];

        return res.status(200).json(
            new ApiResponse(200, channelInfo, "Channel information fetched successfully")
        );
    } catch (error) {
        console.error("Error in getChannelAbouts:", error);
        throw new ApiError(500, "Error fetching channel information", error);
    }
});

export { getChannelStats, getChannelVideos, getChannelAbouts };
