import { updateDoc , doc } from "firebase/firestore";
import { firestore } from "../config/firebase";


export const updateUser = async (
    uid,
    updateData
) => {
    try {
        const userRef = doc(firestore, "users", uid)
        await updateDoc(userRef, updateData)

        // fetch the user and update user stats from authcontext
        return { success:true, msg:"updated successfully"}
        
    } catch (error) {
        console.log("error updating the user", error);
        return {success: false, msg: error?.message}
        
    }
}