
import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user._id;

    //TODO: create playlist
     // check if name and description is provided
  if (
    !(name && description) ||
    name.trim() === "" ||
    description.trim() === ""
  ) {
    throw new ApiError(400, "Playlist name and decription is required");
  }

    // check if user is authenticated
    const user = User.findById(req.user._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // create new playlist
    const newPlaylist = new Playlist ({
        name ,
        description,
        owner : userId
    });

    // saving playlist to the database
    const savedPlaylist = await newPlaylist.save();

    res
    .status(200)
    .json({
        success : true ,
        data : savedPlaylist
    })
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

  const {page = 1 , limit = 10} = req.query;

  //check if user id is valid

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400 , "Invalid user ID")
  }

  // Check if user Exists 
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404 , "User not found")
  }

  const pageNumber = parseInt(page , 10);
  const limitNumber = parseInt(limit , 10);

  const playlists = await Playlist.aggregate([
    {
        $match : {
            owner : new mongoose.Types.ObjectId(userId),
        },
    },
    {
        $lookup : {
            from : "videos",
            localField : "video",
            foreignField : "_id",
            as : "video",
            pipeline : [
                {
                    $lookup : {
                        from : "users",
                        localField : "owner",
                        foreignField : "_id",
                        as : "VideoOwner",
                        pipeline : [
                            {
                                $project : {
                                    username : 1,
                                    avatar : 1,
                                    fullname : 1,
                                },
                            },
                        ],
                    },
                },
                {
                    $addFields : {
                        VideoOwner : {$arrrayElemAt : ["VideoOwner" , 0]},
                    },
                },
                {
                    $project: {
                        thumbnail: "$thumbnail.url",
                        title: 1,
                        videoFile: "$videoFile.url",
                        duration: 1,
                        views: 1,
                        description: 1,
                        videoOwner: "$VideoOwner",
                    },
                },
            ],
        },
    },
    {
        $addFields : {
            video : "$video"
        },
    },
    {
        $addFields : {
            totalVideos : {$size  : "$video"},
        },
    },
    {
        $skip : (pageNumber - 1) * limitNumber
    },
    {
        limit : limitNumber,
    },
  ]);
  
  if (!playlists) {
    throw new ApiError(404, "Error Fetching User Playlists");
}

const totalPlaylists = await Playlist.countDocuments({ owner: userId });
const totalPages = Math.ceil(totalPlaylists / limitNumber);

// Return response
return res.status(200).json(
    new ApiResponse(
        200,
        {
            playlists,
            totalPages,
            currentPage: pageNumber,
        },
        playlists.length === 0 ? "No Playlist Found" : "User playlists retrieved successfully"
    )
);
});
  

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400 , 'Invalid User id')
    }

    const playlist = await Playlist.aggregate([
        {
          // Stage 1: Match Stage
          // This stage filters the playlists to include only those owned by the specified user.
          $match: {
            _id: new mongoose.Types.ObjectId(playlistId),
          },
        },
        {
          // Stage 2: Lookup Stage for Videos
          // This stage performs a lookup to join the "videos" collection with the "playlists" collection.
          // It matches the "video" field in the "playlists" collection with the "_id" field in the "videos" collection.
          // The resulting video documents are added to the "video" field in the resulting documents.
          $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "video",
            pipeline: [
              {
                // Sub-pipeline Stage 1: Lookup Stage for Video Owners
                // This stage performs a lookup to join the "users" collection with the "videos" collection.
                // It matches the "owner" field in the "videos" collection with the "_id" field in the "users" collection.
                // The resulting user documents (video owners) are added to the "VideoOwner" field in each video document.
                $lookup: {
                  from: "users",
                  localField: "owner",
                  foreignField: "_id",
                  as: "VideoOwner",
                  pipeline: [
                    {
                      // Sub-pipeline Stage 1.1: Project Stage
                      // This stage projects only the necessary fields from the "users" collection.
                      // It includes the "username", "avatar", and "fullname" fields in the resulting "VideoOwner" documents.
                      $project: {
                        username: 1,
                        avatar: 1,
                        fullname: 1,
                      },
                    },
                  ],
                },
              },
              {
                // Sub-pipeline Stage 2: Add Fields Stage
                // This stage adds a new field "VideoOwner" to each video document.
                // It sets the value of "VideoOwner" to the first element of the "VideoOwner" array.
                // This is necessary because the lookup stage returns an array, even if there's only one matching document.
                $addFields: {
                  VideoOwner: {
                    $first: "$VideoOwner",
                  },
                },
              },
              {
                // Sub-pipeline Stage 3: Project Stage
                // This stage projects only the necessary fields from each video document.
                // It includes the "thumbnail", "title", "videoFile", "duration", "views", "description", and "VideoOwner" fields.
                $project: {
                  thumbnail: "$thumbnail.url",
                  title: 1,
                  videoFile: "$videoFile.url",
                  duration: 1,
                  views: 1,
                  description: 1,
                  videoOwner: "$VideoOwner",
                },
              },
            ],
          },
        },
        {
          // Stage 3: Add Fields Stage
          // This stage ensures that the "video" field contains the video documents retrieved in the previous lookup stage.
          $addFields: {
            video: "$video",
          },
        },
        {
          // Stage 4: Add Fields Stage for Total Videos
          // This stage adds a new field "totalVideos" to each playlist document.
          // It sets the value of "totalVideos" to the number of videos in the "video" field.
          $addFields: {
            totalVideos: {
              $size: "$video",
            },
          },
        },
        {
          // Stage 5: Lookup Stage for Playlist Owner
          // Joins the "users" collection with the "playlists" collection.
          // Matches the "owner" field in the "playlists" collection with the "_id" field in the "users" collection.
          // Adds the resulting user documents (playlist owner) to the "PlaylistOwner" field in each playlist document.
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "PlaylistOwner",
            pipeline: [
              {
                // Sub-pipeline Stage: Project Stage
                // Projects only the necessary fields from the "users" collection.
                // Includes the "username", "avatar", and "fullname" fields in the resulting "PlaylistOwner" documents.
                $project: {
                  username: 1,
                  avatar: 1,
                  fullname: 1,
                },
              },
            ],
          },
        },
        {
          // Stage 6: Add Fields Stage for Playlist Owner
          // Adds a new field "PlaylistOwner" to each playlist document.
          // Sets the value of "PlaylistOwner" to the first element of the "PlaylistOwner" array.
          // This is necessary because the lookup stage returns an array, even if there's only one matching document.
          $addFields: {
            PlaylistOwner: {
              $first: "$PlaylistOwner",
            },
          },
        },
        {
          // Stage 7: Unset Stage
          // Removes the "owner" field from the playlist documents.
          $unset: "owner",
        },
      ]);
      // check if playlist were found
      if (!playlist) {
        throw new ApiError(404, "Error Fetching User Playlists");
      }
    
      //return first value of Playlists array as response
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            playlist[0],
            "User playlists retrieved successfully"
          )
        );
    });    

    const addVideoToPlaylist = asyncHandler(async (req, res) => {
        const { playlistId, videoId } = req.params;
      
        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
          throw new ApiError(400, 'Invalid playlist id or video id');
        }
      
        // Check if the playlist exists
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
          throw new ApiError(404, 'Playlist not found');
        }
      
        // Check if the user is authenticated
        const user = await User.findById(req.user?._id);
        if (!user) {
          throw new ApiError(404, 'User not found');
        }
      
        // Check if the video exists
        const video = await Video.findById(videoId);
        if (!video) {
          throw new ApiError(404, 'Video not found');
        }
      
        // Check if the user is the owner of the playlist
        if (user._id.toString() !== playlist.owner.toString()) {
          throw new ApiError(403, 'Unauthorized access');
        }
      
        // Check if the video is already in the playlist
        if (playlist.video.includes(videoId)) {
          throw new ApiError(400, 'Video already in playlist');
        }
      
        // Add the video to the playlist
        playlist.video.push(videoId);
        const updatedPlaylist = await playlist.save();
      
        // Return response
        return res
          .status(200)
          .json(
            new ApiResponse(200, 
                updatedPlaylist, 
                'Video added to playlist successfully')
          );
      });
      
      const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
        const { playlistId, videoId } = req.params;
      
        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
          throw new ApiError(400, 'Invalid playlist id or video id');
        }
      
        // Check if the playlist exists
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
          throw new ApiError(404, 'Playlist not found');
        }
      
        // Check if the user is authenticated
        const user = await User.findById(req.user._id);
        if (!user) {
          throw new ApiError(404, 'User not found');
        }
      
        // Check if the video exists
        const video = await Video.findById(videoId);
        if (!video) {
          throw new ApiError(404, 'Video not found');
        }
      
        // Check if the user is authorized to remove the video from the playlist
        if (playlist.owner.toString() !== user._id.toString()) {
          throw new ApiError(403, 'Unauthorized access, you are not allowed to perform this action');
        }
      
        // Check if the video is in the playlist
        const videoIndex = playlist.video.indexOf(videoId);
        if (videoIndex === -1) {
          throw new ApiError(400, 'Video not in playlist');
        }
      
        // Remove the video from the playlist
        playlist.video.splice(videoIndex, 1);
        const updatedPlaylist = await playlist.save();
      
        return res
        .status(200)
        .json
        (new 
            ApiResponse
            (200,
             updatedPlaylist,
              'Video removed from playlist successfully'
            ));
      });

      const deletePlaylist = asyncHandler(async (req, res) => {
        const { playlistId } = req.params;
        // TODO: delete playlist
      
        // check if playlistId is valid
        if (!isValidObjectId(playlistId)) {
          throw new ApiError(400, "Invalid playlist id");
        }
      
        // check if playlist exists
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
          throw new ApiError(404, "Playlist not found");
        }
      
        // check if user is authenticated
        const user = await User.findById(req.user?._id);
        if (!user) {
          throw new ApiError(404, "User not found");
        }
      
        // check if user is authorized to delete playlist
        if (playlist?.owner.toString() !== user?._id.toString()) {
          throw new ApiError(
            403,
            "Unauthorized access, you are not allowed to perform this action"
          );
        }
      
        // delete playlist
        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
        if (!deletedPlaylist) {
          throw new ApiError(500, "Error deleting playlist");
        }
      
        // return response
        return res
          .status(200)
          .json(new ApiResponse(200, [], "Playlist deleted successfully"));
      });

      const updatePlaylist = asyncHandler(async (req, res) => {
        const { playlistId } = req.params;
        const { name, description } = req.body;
      
        // Validate playlistId
        if (!mongoose.Types.ObjectId.isValid(playlistId)) {
          throw new ApiError(400, "Invalid playlist id");
        }
      
        // Check if at least one of name or description is provided
        if (!name && !description) {
          throw new ApiError(400, "Playlist name or description is required");
        }
      
        // Find the playlist
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
          throw new ApiError(404, "Playlist not found");
        }
      
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
          throw new ApiError(401, "User not authenticated");
        }
      
        // Check if user is authorized to update the playlist
        if (playlist.owner.toString() !== req.user._id.toString()) {
          throw new ApiError(403, "Unauthorized access, you are not allowed to perform this action");
        }
      
        // Update playlist fields if provided
        if (name && name.trim() !== "") {
          playlist.name = name;
        }
        if (description && description.trim() !== "") {
          playlist.description = description;
        }
      
        // Save the updated playlist
        const updatedPlaylist = await playlist.save();
      
        // Return response
        return 
        res
        .status(200)
        .json
        (
            new ApiResponse
            (200,
             updatedPlaylist,
            "Playlist updated successfully"));
      });
    
export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
