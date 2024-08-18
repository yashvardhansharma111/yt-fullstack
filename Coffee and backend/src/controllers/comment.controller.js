import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // Get video ID and pagination parameters from request
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate video ID
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Convert pagination parameters to integers
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    try {

        //Check if video exists or not
        const videoExists = await Video.exists({_id : videoId});
        if (!videoExists) {
            throw new ApiError(404 , "Video not found")
        }

        // Aggregation pipeline to get comments
        const comments = await Comment.aggregate([
            { $match: { video: new mongoose.Types.ObjectId(videoId)} },
            { $sort: { createdAt: -1 } },
            { $skip: (pageInt - 1) * limitInt },
            { $limit: limitInt },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                    pipeline : [
                        {
                            $project : {_id  : 1 , username : 1 , avatar : 1 }
                        }
                    ]
                }
            },
            { $unwind: "$owner" },
            {sort : {createdAt : -1}}
            
        ]);

        const options = {
            page: pageInt,
            limit: limitInt,
            customLabels: {
                totalDocs: 'totalComments',
                docs: 'comments',
            }
        };

        // Paginate results
        const result = await Comment.aggregatePaginate(commentAggregate, options);

          // Return the comments in the response
         return res
          .status(200)
          .json(
            new ApiResponse
            (200, 
                result, 
                result.totalComments === 0 ? "No Comments Found" : "Comments fetched successfully"));
        } catch (error) {
            console.error("Error in getVideoComments:", error);
            throw new ApiError(500, "An error occurred while fetching comments");
        }
    });

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    //Algorithm for adding comment 
    //1. Extract data from request by req.params (video id) and req.body 
    //2 . Validate Input data
    // 3 . find the video
    // 4 . Create comment document
    // 5 . Save comment to database
    // 6 . Update video document
    // 7 . Send response

    const { videoId } = req.params ; 
    const {content , userId} = req.body ;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400 , "Invalid video ID")
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
        throw new ApiError(400 , "Content is required and cant be empty")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400 , "Invalid user Id")
    }

    const video = await Video.findById(videoId);

     if(!video){
        throw new ApiError (400 , "Video not found")
     }

     const newComment = new Comment ({
        content ,
        video : videoId,
        owner : userId, 
        createdAt : new Date()
     });

     await newComment.save();

     video.commentCount = (video.commentCount || 0) + 1; 
     await video.save();

     return res
     .status(201)
     .json(
        new ApiResponse(201 , newComment , "comment added successfully" )
     )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    //Algorithm for updating comment 
    //1. Extract data from request by req.params (video id) and req.body 
    //2 . Validate Input data
    // 3 . find the comment
    // 4 . Update comment document
    // 5 . Send response

    const { commentId } = req.params ;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400 , " Invalid comment Id")
    }

     // Get the comment content from the request body
     const { content } = req.body;
     if (!content || content.trim() === "") {
         throw new ApiError(400, "Content is required and cannot be empty");
         }

    const comment  = await Comment.findById(commentId , {_id : 1, owner : 1});
    if(!comment){
        throw ApiError(404 , "Comment not found")
    }

    // Check if the user is the owner of the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.content = content.trim();
    const updatedComment = await comment.save();

     return res
    .status(200)
    .json(
     new ApiResponse (
        200 , 
        updatedComment, 
        "Comment updated Successfully" , ) 
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params ;
   
   if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(401 , "Invalid commentId")
   }

   const comment = await Comment.findById(commentId , {_id : 1 , owner :1});
   if(!comment){
    throw new ApiError(404 , "comment not found ")
   }

 // Check if the user is the owner of the comment
 if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to perform this action");
}   

const deletedComment = await Comment.findByIdAndDelete(commentId)
if(!deletedComment){
    throw new ApiError(500 , "Comment not deleted successfully")
}

   const video = await Video.findById(comment.video);
   if (video) {
    video.commentCount = Math.max(0 , video.commentCount - 1);
    await video.save();
   }

    return res
   .status(200)
   .json(
    new ApiResponse (200 ,{} , "Comment deleted Successfully" ));

});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }