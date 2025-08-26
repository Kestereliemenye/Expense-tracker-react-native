import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../constants";

import axios from "axios"

const CLOUDINARY_API_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  // func to upload file to cloudinary
export const uploadFileToCloudinary = async (
    file,
    folderName
) => {
  try {
      if(!file) return{success: true, data: null}
        if (typeof file === "string") {
        return { success: true, data:file };
            
        }
        // if file has a url
        if (file && file.url) {
            const formData = new FormData();
            formData.append("file", {
                url: file?.url,
                type: "images/jpeg",
                name: file?.url?.split('/').pop() || "file.jpg"
            })
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
            formData.append("folder", folderName)


            // to uplaod file
            const response = await axios.post(CLOUDINARY_API_URL, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            

            // once file uploads
            return{success: true, data: response?.data?.secure_url}

        }



        return{success:true}
        
    } catch (error) {
        console.log("got error uploading file", error);
        return{success: false, msg: error.msg || "could not uplaod file"}
        
    }
  }


export const getProfileImage = (file) => {
    if (file && typeof file == "string") return file;
    if (file && typeof file == "object") return file.uri;

    return require("../assets/images/defaultAvatar.png")
}
export const getFilePath = (file) => {
  if (file && typeof file == "string") return file;
  if (file && typeof file == "object") return file.uri;

  return null;
};

// basically if no file return the default im but if tere is file load it 