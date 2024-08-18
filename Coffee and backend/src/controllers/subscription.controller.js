import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(401, "Invalid channel id");
  }

  const subscriberId = req.user?._id;
  if (!subscriberId) {
    throw new ApiError(401, "Invalid User");
  }

  // Toggle subscription
  const isSubscribed = await Subscription.findOne({ subscriber: subscriberId, channel: channelId });
  let response;
  try {
    response = isSubscribed 
      ? await Subscription.deleteOne({ subscriber: subscriberId, channel: channelId })
      : await Subscription.create({ subscriber: subscriberId, channel: channelId });
  } catch (error) {
    console.log("toggleSubscriptionError :: ", error);
    throw new ApiError(500, error?.message || "Internal server Error");
  }

  return res
  .status(200)
  .json(new ApiResponse
    (200,
     response,
     isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully"));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(401, "Invalid channel Id");
  }

  const channelSubscribers = await Subscription.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
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
        subscriber: { $first: "$subscriber" },
      },
    },
  ]);

  const subscribersList = channelSubscribers.map((item) => item.subscriber);
  return res
  .status(200)
  .json( 
    new ApiResponse(
    200, 
    subscribersList,
     "Subscriber list fetched successfully"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(401, "Invalid subscriber Id");
  }

  const channelSubscribedTo = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedTo",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        subscribedTo: { $first: "$subscribedTo" },
      },
    },
  ]);

  const subscribedToList = channelSubscribedTo.map((item) => item.subscribedTo);
  return res
  .status(200)
  .json(
    new ApiResponse(
    200,
    subscribedToList,
    "Subscribed to list fetched successfully"));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};