import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import {deleteFromCloudinary , deleteVideoFromCloudinary,  uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query = "", sortBy  = "createdAt" , sortType = "desc" , userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const pageNumber = parseInt(page , 10);
    const limitNumber = parseInt(limit , 10);
    const sortDirection = sortType = 'asc' ? 1 : -1 ;

    const matchCondition = {
        $and : [
            {
                $or : [
                    {
                        title : {regex : query , $options : 'i'}
                    },
                    {
                        description : {regex : query , $options : 'i'}
                    }
                ]
            },
            userId ? {owner : mongoose.Types.ObjectId(userId) , isPublished : true} : {}
        ]
    };

    try {
        // Build the aggregation pipeline
        const pipeline = [
            {
                $match : matchCondition
            },
            {$lookup : {
               from : 'users',
               localField : 'owner',
               foreignField : '_id',
               as : 'owner',
               pipeline : [
                {
                    $project : {_id:1 , username:1 , email:1 , avatar : 1}
                }
               ]
            }},
            {$unwind : '$owner'},
            {$sort : {[sortBy] : sortDirection}},
            {$skip : (pageNumber -1) * limitNumber},
            {limit : limitNumber},
            {
                $facet : {
                    metadata : [{$count : 'total'},{addFields : {page : pageNumber}}],
                    data : [{$project : {_id : 1 , title  : 1 , description : 1 ,createdAt : 1 , owner : 1}}]
                }
            },
            {$unwind : '$metadata'}
        ];

        //Execute the aggregate pipeline
        const results = await Video.aggregate(pipeline);
        const {metadata , data : videos} = results.lenght > 0 ? results[0] : {metadata : { total : 0 , page : 1} , data : [] };
        
        const totalPages = Math.ceil(metadata.total / limitNumber)

        res
        .status(200)
        .json ( 
            new ApiResponse (200 , {
                videos ,
                totalPages ,
                currentPage : metadata.page,
                totalVideos : metadata.total
            })
        )
    } catch (err) {
        console.error('Error in aggregation :' , err);
        throw new ApiError( 500 , err.message || 'Internal server error in video aggregation');
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body;
    const ownerId = req.user?._id;
    // TODO: get video, upload to cloudinary, create video

    if (!ownerId) {
        throw new ApiError(401 , 'Invalid User');
    }

    if ([title , description].some((field) => field.trim === '')) {
        throw new ApiError(400 , 'All fields are required');
    }

    const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFileLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400 , 'Video File and Thumbnail are required')
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoFile || !thumbnail) {
        throw new ApiError(500 , 'failed to upload video and thumbnail on cloudinary')
    }

    const newVideo = await Video.create ({
        title ,
        description,
        videoFile : {publicId : videoFile.public_id , url: videoFile.url},
        thumbnail : {thumbnailId : thumbnail.public_id , url : thumbnail.url},
        owner : ownerId,
        duration : videoFile.duration,
        createdAt : new Date()
    })

    if (!newVideo) {
        throw new ApiError(500 , 'Something went wrong while uploading the file')
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            201 ,
            newVideo,
            "Video published Successfully"
        )
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId)) {
        throw new ApiError(401 , 'Invalid video Id')
    }

    //Find the video in the video collection
    const videoFind = await Video.findById(videoId);

    if (!videoFind) {
        throw new ApiError(404 , 'video not Found')
    }

    //Find the user and their watch history
    const userFind = await User.findById(req.user?._id , {watchhistory : 1});
    if (!userFind) {
        throw new ApiError(404 , 'User not found')
    }

    //Incrementing the user view if user not viewed it previously
    if (!userFind.watchhistory.includes(videoId)) {
        await Video.findByIdAndUpdate(
            videoId ,
            {
                $inc : {views  : 1}
            },
            {new : true}
        );

        //Adding video to user search history
        await User.findByIdAndUpdate(req.user._id , {
            $addToSet : {watchhistory : videoId},
        });
    }

    // An aggregation pipeline to get video along with its owner details

    const video = await Video.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup : {
                from : 'users',
                localField : 'owner',
                foreignField : '_id',
                as : 'owner',
                pipeline : [
                    {$project: {
                        username : 1,
                        avatar : 1 ,
                        email : 1 ,
                        fullname : 1
                    },
                },
                ],
            },
        },
        {
            $addFields: {
                owner : { $first :  '$owner'},
                videoFile :  '$videoFile.url',
                thumbnail : '$thumbnail.url',
            },
        },
    ]);

    //If no video found throw an error
    if(!video || video.legth === 0){
        throw new ApiError(400 , 'Video not found')
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video[0],
            "the video is fetched successfully"
        )
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const {title , description } = req.body;
    const thumbnailLocalPath = req.file?.path;
    //TODO: update video details like title, description, thumbnail

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400 , 'Invalid Video Id')
    }

    if (!(title || description || thumbnailLocalPath)) {
        throw new ApiError(400, "At least one field (title, description, or thumbnail) is required");
      }

    //Find the old video and return only the thumbnail object
    const oldVideo = await Video.findById(videoId , {thumbnail : 1});

    if (!oldVideo) {
        throw new ApiError(404 , 'Video not found')
    }

    let newThumbnail = oldVideo.thumbnail;

    //Upload new Thumbnail if provided
    if (thumbnailLocalPath) {
        newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!newThumbnail) {
            throw new ApiError(500 , "An error occur while uploading thumbnail on cloudinary")
        }
    }

    // Update the video details
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
        ...(newThumbnail && { thumbnail: { publicId: newThumbnail.public_id, url: newThumbnail.url } })
      }
    },
    { new: true }
  );

  // If new thumbnail is uploaded delete the old one 
  if (thumbnailLocalPath && oldVideo.thumbnail?.publicId) {
    const deleteOldThumbnail = await deleteFromCloudinary(oldVideo.thumbnail.publicId);

    if (deleteOldThumbnail.result !== 'ok') {
        throw new ApiError(500 , "Error while deleting old thumbnail from cloudinary")
    }
  }

  res
  .status(200)
  .json(
    200 ,
    updatedVideo,
    "Video details updated successfully"
  )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(401 , "Invalid video Id")
    }

     // Fetch video details
  const video = await Video.findById(videoId, { _id: 1, owner: 1, videoFile: 1, thumbnail: 1 });
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Validate ownership
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(401 , "You are not authorized to perform this action")
  }

  try {
    //Delete video from cloudinary
    const [deletedVideo , deletedThumbnail] = await Promise.all([
        deleteVideoFromCloudinary(video.videoFile.publicId),
        deleteFromCloudinary(video.thumbnail.publicId),
    ]);

     // Check if both the video and thumbnail were successfully deleted
     if (deletedVideo.result !== 'ok' || deletedThumbnail.result !== 'ok') {
        throw new ApiError(500, "An error occurred while deleting video from Cloudinary");
      }

      //Delete video from database and from user Search history
      await Promise.all([
        Video.findByIdAndDelete(videoId),
        User.updateMany({watchhistory : videoId} ,
             {$pull : {watchhistory : videoId}}
             ,{new : true}
            ),
      ]);

      //Send response
      res
      .status(200)
      .json(
        new ApiResponse(
            200,
            {},
            'video Deleted successfully'
        )
      )
  } catch (error) {
    console.error('Error during video deletion:', error);
    throw new ApiError(500, "An error occurred while deleting the video");
  }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
  
    // Validate Video ID
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid Video ID");
    }
  
    // Fetch video details
    const video = await Video.findById(videoId, { _id: 1, isPublished: 1, owner: 1 });
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
  
    // Validate owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(401, "You are not authorized to perform this action");
    }
  
    // Toggle publish status
    video.isPublished = !video.isPublished;
  
    // Save changes
    await video.save();
  
    // Return response
    res.status(200).json(
      new ApiResponse(
        200,
        video,
        video.isPublished ? "Video Published" : "Video Unpublished"
      )
    );
  });

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}