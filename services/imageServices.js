import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../constants";

import axios from "axios";

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// func to upload file to cloudinary
export const uploadFileToCloudinary = async (file, folderName) => {
  try {
    if (!file) return { success: true, data: null };
    if (typeof file === "string") {
      return { success: true, data: file };
    }
    // if file has a url
    if (file && file.uri) {
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || "image/jpeg",
        name: file.fileName || file.uri.split("/").pop() || "file.jpg",
      });
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", folderName);

      // to uplaod file
      const response = await axios.post(CLOUDINARY_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // once file uploads
      return { success: true, data: response?.data?.secure_url };
    }
    
    return { success: true };
  } catch (error) {
    console.log("Using upload preset:", CLOUDINARY_UPLOAD_PRESET);
    console.log("got error uploading file", error);
    console.log("Full error:", error, error?.response?.data);
    // console.log("Uploading file to Cloudinary:", file);
    return { success: false, msg: error.msg || "could not uplaod file" };
  }
};
export const getProfileImage = (file) => {
  if (file && typeof file === "string" && file.trim() !== "") {
    return { uri: file };
  }
  if (file && typeof file === "object" && file.uri && file.uri.trim() !== "") {
    return { uri: file.uri };
  }
  return require("../assets/images/defaultAvatar.png");
};
export const getFilePath = (file) => {
  if (file && typeof file == "string") return file;
  if (file && typeof file == "object" && file.uri) return file.uri;

  return null;
};

// basically if no file return the default im but if tere is file load it
