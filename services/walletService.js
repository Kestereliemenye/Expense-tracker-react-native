import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageServices";
import { firestore } from "../config/firebase";

export const createOrUpdateWallet = async (walletData) => {
  try {
    let walletToSave = { ...walletData };

    // handle image upload
    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );

      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload the wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }

    //   if new wallet
    if (!walletData?.id) {
      (walletToSave.amount = 0),
        (walletToSave.totalIncome = 0),
        (walletToSave.totalExpenses = 0),
        (walletToSave.created = new Date());
    }
    // if same id it should edit the wallet icon but if no id create new wallet
    const walletRef = walletData?.id
    
    ? doc(firestore, "wallets", walletData?.id)
    : doc(collection(firestore, "wallets"));


    await setDoc(walletRef, walletToSave, { merge: true }); // updates only the data provide
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error) {
    console.log("error creating or updating the waller", error);
    return { success: false, msg: error.message };
  }
};

// delete wallet function
export const deletewallet = async (walletId) => {
  try {
    // get wallet from firestore
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);

    // todo: to delete all transaction related to the wallet
    deleteTransactionsByWalletId(walletId)

    return { success: true, msg: "wallet deleted successfully" };
  } catch (error) {
    console.log("error deleting the wallet:", error);
    return { success: false, msg: error.message };
  }
};
export const deleteTransactionsByWalletId = async (walletId) => {
  try {
    let hasMoreTransaction = true;
    while (hasMoreTransaction) {
      const transactionQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId) // goes through the database to find which transaction has the wallet id so it deletes all
      )

      const transactionSnapshot = await getDocs(transactionQuery)
      if (transactionSnapshot === 0) {
        hasMoreTransaction = false;
        break;
      }

      const batch = writeBatch(firestore);
      transactionSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref)
      })
      await batch.commit()

      
    }
    return { success: true, msg: "All transactions deleted successfully" };



    return { success: true, msg: "wallet deleted successfully" };
  } catch (error) {
    console.log("error deleting the wallet:", error);
    return { success: false, msg: error.message };
  }
};
