import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import { uploadFileToCloudinary } from "./imageServices";

export const createOrUpdateTransaction = async (transactionData) => {
  try {
    const { id, type, walletId, image, amount } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!" };
    }
    // if data
    if (id) {
      //  upddate existing transaction

    } else {
      //update wallet
      //updateWallet for new transaction
      let res = await updateWalletForNewTransaction(
        walletId,
        Number(amount),
        type,
      );
      if (!res.success) return res;
    }
    if (image) {
      const imageUplaodRes = await uploadFileToCloudinary(
        image,
        "transactions"
      );
      if (!imageUplaodRes.success) {
        return {
          success: false,
          msg: imageUplaodRes.msg || "Failed to uplaod receipt",
        };
      }

        transactionData.image = imageUplaodRes.data;
        // console.log(transactionData.image);
        
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions")); // if no existing transaction
    // to create or update transaction depending on existing id
    await setDoc(transactionRef, transactionData, { merge: true });
    return { success: true, data: {...transactionData, id:transactionRef.id} };
  } catch (error) {
    console.log("error creating or updating transaction:", error);
    return { success: false, msg: error.message };
  }
};

const updateWalletForNewTransaction = async (walletId, amount, type) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      console.log("error  updating wallet for a new  transaction:");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data(); // gotten amount
    // to check if amount is enough
    if (type === "expense" && walletData.amount - amount < 0) {
      return {
        success: false,
        msg: "Selected wallet does not have enough balance",
      };
    }

    const updatedType = type === "income" ? "totalIncome" : "totalExpenses";

    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotal =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    // to update wallet
    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updatedType]: updatedTotal,
    });

    return { success: true };
  } catch (error) {
    console.log("error  updating wallet for a new  transaction:", error);
    return { success: false, msg: error.message };
  }
};
