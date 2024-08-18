import { Router } from "express";
import {
     changeCurrentPassword,
     getCurrentUser, 
     getUserChannelProfile, 
     getWatchHistory, 
     loginUser, 
     logoutUser, 
     refreshAccessToken,
     registerUser, 
     updateAccountDetails, 
     updateUserAvatar, 
     updateUserCoverImage
     } 
     from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

/*router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)*/

    router.post('/register', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), async (req, res) => {
        try {
          console.log("Files received:", req.files);
      
          const avatarLocalPath = req.files?.avatar?.[0]?.path;
          const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
      
          console.log("Avatar Local Path:", avatarLocalPath);
          console.log("Cover Image Local Path:", coverImageLocalPath);
      
          if (!avatarLocalPath) {
            throw new Error("Avatar file is required");
          }
      
          const avatar = await uploadOnCloudinary(avatarLocalPath);
          const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;
      
          if (!avatar) {
            throw new Error("Failed to upload avatar to Cloudinary");
          }
      
          // Proceed with creating the user in your database
          res.status(201).json({
            success: true,
            message: "Files uploaded and user registered successfully",
            avatarUrl: avatar.url,
            coverImageUrl: coverImage?.url || null,
          });
        } catch (error) {
          console.error("Error:", error.message);
          res.status(500).json({
            success: false,
            error: error.message,
          });
        }
      })

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT , logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT , changeCurrentPassword)

router.route("/current-user").get(verifyJWT , getCurrentUser)

router.route("/update-account").patch(verifyJWT , updateAccountDetails)

router.route("/avatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar)

router.route("/cover-image").patch(verifyJWT , upload.single("coverImage") , updateUserCoverImage)

router.route("/c/:username").get(verifyJWT , getUserChannelProfile)

router.route("/watch-history").get(verifyJWT , getWatchHistory)

export default router 