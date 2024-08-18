import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

/*const uploadOnCloudinary = async (localFilePath) => {
  try {
      if (!localFilePath) return null
      //upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto"
      })
      // file has been uploaded successfull
      //console.log("file is uploaded on cloudinary ", response.url);
      fs.unlinkSync(localFilePath)
      return response;

  } catch (error) {
      fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
      return null;
  }
}*/

 export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("Local file path is not defined!");
      return null;
    }

    console.log(`Uploading file from: ${localFilePath}`);
    const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });
    
    // File uploaded successfully
    console.log("File uploaded successfully to Cloudinary:", response.url);

    // Remove file from local storage after upload
    fs.unlinkSync(localFilePath);
    console.log("Local file deleted:", localFilePath);

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);

    // Ensure to remove local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted after failure:", localFilePath);
    }

    return null;
  }
};

export const deleteFromCloudinary = async (fileToDelete) => {
  try {
    const response = await cloudinary.uploader.destroy(fileToDelete, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return null;
  }
};

export const deleteVideoFromCloudinary = async (fileToDelete) => {
  try {
    const response = await cloudinary.uploader.destroy(fileToDelete, {
      resource_type: "video",
    });
    return response;
  } catch (error) {
    console.error("Error deleting video from Cloudinary:", error);
    return null;
  }
};

//export { uploadOnCloudinary, deleteFromCloudinary, deleteVideoFromCloudinary };
