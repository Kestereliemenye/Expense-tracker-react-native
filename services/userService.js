import { updateDoc , doc } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { uploadFileToCloudinary } from "./imageServices";


export const updateUser = async (
    uid,
    updateData
) => {
    try {
        if (updateData.image && updateData?.image?.url) {
            const imageUplaodRes = await uploadFileToCloudinary(updateData.image, "users")
            if (!imageUplaodRes.success) {
                return{success:false, msg: imageUplaodRes.msg || "Failed to uplaod image" }
            }

            updateData.image = imageUplaodRes.data
        }

        const userRef = doc(firestore, "users", uid)
        await updateDoc(userRef, updateData)

        // fetch the user and update user stats from authcontext
        return { success:true, msg:"updated successfully"}
        
    } catch (error) {
        console.log("error updating the user", error);
        return {success: false, msg: error?.message}
        
    }
}