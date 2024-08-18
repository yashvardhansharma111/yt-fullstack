import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user._id;

  // Check if content is provided
  if (!content || content.trim() === '') {
    throw new ApiError(400, "Tweet content cannot be empty");
  }

  // Create new tweet
  const tweet = new Tweet({
    owner: userId,
    content: content.trim(),
    createdAt: new Date(),
  });

  await tweet.save();

  // Return response
  res.status(200).json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if userId is valid ObjectId
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Fetch user's tweets with pagination
  const tweetsAggregation = Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
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
              email: 1,
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "TweetCount",
      docs: "Tweets",
    },
  };

  const tweetResult = await Tweet.aggregatePaginate(tweetsAggregation, options);

  if (!tweetResult) {
    throw new ApiError(500, "Internal error occurred while fetching tweets");
  }

  // Return response
  res.status(200).json(new ApiResponse(200, tweetResult, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  // Validate tweetId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet ID");
  }

  // Validate content
  if (!content || content.trim() === '') {
    throw new ApiError(400, "Tweet content cannot be empty");
  }

  // Check if tweet exists
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // Validate tweet owner
  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this tweet");
  }

  // Update tweet content
  tweet.content = content.trim();
  await tweet.save();

  // Return response
  res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  // Validate tweetId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet ID");
  }

  // Check if tweet exists
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // Validate tweet owner
  if (tweet.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet");
  }

  // Delete tweet
  await tweet.remove();

  // Return response
  res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet
    , getUserTweets
    , updateTweet,
     deleteTweet };