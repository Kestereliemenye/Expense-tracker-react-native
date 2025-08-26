import { collection, doc, setDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServices";
import { firestore } from "../config/firebase";

export const createOrUpdateWallet = async (walletData) => {
  try {
    let walletToSave = { ...walletData };
      if (walletData.image) {
          const imageUplaodRes = await uploadFileToCloudinary(
              walletData.image,
              "wallets"
          );
          if (!imageUplaodRes.success) {
              return {
                  success: false,
                  msg: imageUplaodRes.msg || "Failed to uplaod the wallet icon",
              };
          }
          walletData.image = imageUplaodRes.data;
      }

      //   if new wallet
      if (!walletData?.id) {
        walletToSave.amount = 0,
          walletToSave.totalIncome = 0,
          walletToSave.totalExpenses = 0,
          walletToSave.created = new Date()
      }
      // if same id it should edit the wallet icon but if no id create new wallet
      const walletRef = walletData?.id
        ? doc(firestore, "wallets", walletData?.id)
        : doc(collection(firestore , "wallets"));

      await setDoc(walletRef, walletToSave, { merge: true }); // updates only the data provide
      return { success: true, data: { ...walletToSave, id: walletRef.id } };
    
  } catch (error) {
    console.log("error creating or updating the waller", error);
    return { success: false, msg: error.message };
  }
};
