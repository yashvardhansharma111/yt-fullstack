import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js" 
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import JWT from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId) 
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken 
        await user.save({validateBeforeSave : false});

        return{accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while genrating access and refresh tokens ")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler( async(req , res) => {
   // req body -> data
   // username or email
   // find the user or dont have an account do signup
   // if user exist check the password
   // access and refresh token
   // send cookie
 
   const {email , username , password} = req.body;

   if (!(email || username)) {
    throw new ApiError(400 , "username or email is required ")
   }

   const user = await User.findOne({
    $or :[{username} , {email}]
   })

   if (!user) {
    throw new ApiError(404 , "User not found 😥")
   }

   const isPasswordValid =  await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401 , "Invalid User credentials 😥")
   }

   const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
    httpOnly: true,
    secure :true
   } 

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200,{
            user: loggedInUser , refreshToken ,accessToken
        },
        "User loggedIn Successfully"
    )
   )

   })

   const logoutUser = asyncHandler( async(req , res) => {

   await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset: {
            refreshToken : 1 // this removes fields from document
        }
    },
    {
        new : true
    }
   )
   const options = {
    httpOnly: true,
    secure :true
   } 

   return res
   .status(200)
   .clearCookie("accessToken" , options)
   .clearCookie("refreshToken" , options)
   .json(new ApiResponse(200 , "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req , res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401 , "Unauthorized Request")
    }

    try {
        const decodedToken = JWT.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if (!user) {
        throw new ApiError(401 , "Invalid refresh token ")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401 , "Refresh token is expired or used")
    }

    const options = {
        httpOnly : true ,
        secure : true
    }

     const {accessToken , newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

     return res
     .status(200)
     .cookies("accessToken" ,accessToken , options)
     .cookies("refreshToken" ,newRefreshToken , options)
     .json(
        new ApiResponse(
            {accessToken , refreshToken : newRefreshToken},
            "Access Token Refreshed Successfully"
        )
     )
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid refresh Token")
    }
})

const changeCurrentPassword = asyncHandler(async(req , res) => {
    const {oldPassword , newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400 , "Invalid Old password ")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
       new ApiResponse(200 ,{} ,"Password changed successfully")
    )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    // If no user is logged in, return a 401 Unauthorized response
    if (!req.user) {
        return res.status(401).json(
            new ApiResponse(401, null, "Unauthorized: No user is logged in")
        );
    }

    // If a user is authenticated, return the user data
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    );
});


const updateAccountDetails = asyncHandler(async(req , res) => {
    const{fullName , email} = req.body

    if(!fullName || !email){
        throw new ApiError(400 , "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName :fullName,
                email : email
            }
        },
        { new : true }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200 , user , "Account details updated Successfully"))
})

const updateUserAvatar = asyncHandler(async(req , res )=> {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw ApiError(400 , "Avatar File is missing")
    }
    //TODO: Delete old image make an utility function

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw ApiError(400 , "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                avatar : avatar.url
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200 , user , "Updating Avatar successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req , res )=> {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {

        throw ApiError(400 , "coverImage File is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw ApiError(400 , "Error while uploading on coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                avatar : avatar.url
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200 , user , "Updating coverImage successfully")
    )
})

const getUserChannelProfile = asyncHandler(async(req , res) => {

    const {username} = req.params

    if (!username) {
        throw new ApiError(400 , "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from :"subscriptions",
                localField: "_id",
                foreignField: "channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from :"subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size: "$subscribers"
                },
                channelsSubscribedToCount:{
                    $size: "$subscribedTo"
                },
                isSubscribed : {
                    $cond: {
                        if: {$in:[req.user?._id , "$subscribers.subscriber"]},
                        then: true,
                        else : false
                    }
                }
            }
        },
        {
        $project:{
            fullName :1,
            username:1,
            subscribersCount:1,
            channelsSubscribedToCount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1,
            email:1
        }
        }
    ])
    if (channel?.length) {
        throw new ApiError(404 , "channel does not exists")
    }
 
    return res
    .status(200)
    .json(
        new ApiResponse(200 , channel[0] , "User channel fetched successfully")
    )

})

const getWatchHistory = asyncHandler(async(req , res) => {

    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user.id) //createFromHexString
            }
        },
        {
            $lookup :{
                from : "videos",
                localField : "watchHistory",
                foreignField : "_id",
                as : "watchHistory",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline : [
                                {
                                    $project : {
                                        fullName : 1,
                                        username : 1 ,
                                        avatar : 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields : {
                        owner : {
                            $first : "$owner"
                        }
                    }}
                ]
            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            user[0].WatchHistory,
            "Watched history fetched successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}