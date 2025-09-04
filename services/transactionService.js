import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import { uploadFileToCloudinary } from "./imageServices";
import { createOrUpdateWallet } from "./walletService";
import { getLast7days } from "../utils/common";
import { colors } from "@/constants/theme";
import { scale } from "@/utils/styling";

export const createOrUpdateTransaction = async (transactionData) => {
  try {
    const { id, type, walletId, image, amount } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data!" };
    }
    // To update a transaction
    if (id) {
      //  upddate existing transaction
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      ); // snapshot is like what the data currently looks like

      const oldTransaction = oldTransactionSnapshot.data(); // gets the snapshot

      const shouldRevertOriginal =
        oldTransaction.type !== type ||
        oldTransaction.amount !== amount ||
        oldTransaction.walletId !== walletId;
      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId
        );
        if (!res.success) return res;
      }
    } else {
      //updateWallet for new transaction
      let res = await updateWalletForNewTransaction(
        walletId,
        Number(amount),
        type
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
    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
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

const revertAndUpdateWallets = async (
  oldTransaction,
  newTransactionAmount,
  newTransactionType,
  newWalletId
) => {
  try {
    // Getting old and newwallet data
    const originalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );

    const originalWallet = originalWalletSnapshot.data();

    // new wallet that will be updating
    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );

    let newWallet = newWalletSnapshot.data();

    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType === `expense`) {
      // if user tries to convert an income to an expense
      //or if user tries to increase expense amount and dont have enough balance
      if (
        oldTransaction.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "The selected wallet does not have enough balance",
        };
      }
      // if user tries to add expense from a a new wallet but dont have enough balance
      if (newWallet.amount < newTransactionAmount) {
        return {
          success: false,
          msg: "The selected wallet does not have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });
    // revert completed

    //  /////////////////////////////////////////////////////////////////
    // refeetch the new wallet because we may have updated it
    newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));

    newWallet = newWalletSnapshot.data();

    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";

    // const updatedTransactionAmount =
    //   newTransactionType === "income"
    //     ? Number(newTransactionAmount)
    //     : -Number(newTransactionAmount);
    const newWalletAmount =
      newTransactionType === "income"
        ? Number(newWallet.amount) + Number(newTransactionAmount)
        : Number(newWallet.amount) - Number(newTransactionAmount);

    const newIncomeExpenseAmount =
      Number(newWallet[updateType]) + Number(newTransactionAmount);

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true };
  } catch (error) {
    console.log("error  updating wallet for a new  transaction:", error);
    return { success: false, msg: error.message };
  }
};

// delete transaction
export const deleteTransaction = async (transactionId, walletId) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    // get the transaction
    const transactionSnapshot = await getDoc(transactionRef);
    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }
    const transactionData = transactionSnapshot.data(); // gets the snapshot

    const transactionType = transactionData?.type;
    const transactionAmount = transactionData?.amount;

    // fetch wallet to update new amounts, totalincome, totalexpense
    const WalletSnapshot = await getDoc(doc(firestore, "wallets", walletId));

    const walletData = WalletSnapshot.data();

    //check fileds to be updates based on transaction type
    const updateType =
      transactionType === "income" ? "totalIncome" : "totalExpenses";
    const newWalletAmount =
      walletData?.amount -
      (transactionType === "income" ? transactionAmount : -transactionAmount); // if type is income - if expense + to the wallet amount
    const newIncomeExpenseAmount = walletData[updateType] - transactionAmount;

    // if user tries to delete expense amount and it goes below zero
    if (transactionType === `expense` || ("income" && newWalletAmount < 0)) {
      return { success: false, msg: "You can not delete this transaction" };
    }
    // update wallet
    await createOrUpdateWallet({
      id: walletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });
    // then delete
    await deleteDoc(transactionRef);
    return { success: true };
  } catch (error) {
    console.log("error  updating wallet for a new  transaction:", error);
    return { success: false, msg: error.message };
  }
};

// get weekly stats
export const fetchWeeklyStats = async (uid) => {
  try {
    const db = firestore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7); // date7 days ago
    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", "==", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)), // stop searching at current date
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const weeklyData = getLast7days();
    const transactions = [];

    // map each transactiion of each day
    querySnapshot.forEach((doc) => {
      const transaction = doc.data(); // get data
      transaction.id = doc.id;
      transaction.push(transactions);

      const transactionDate = transaction.date
        .toDate()
        .toISOString()
        .split("T")[0]; // as specific date

      const dayData = weeklyData.find((day) => day.date === transactionDate);
      if (dayData) {
        if (transaction.type === "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.expense,
        frontColor: colors.rose,
      },
    ]);

    return {
      success: true, data: {
      stats, transactions
    } };
  } catch (error) {
    console.log("error fetching weekly stats", error);
    return { success: false, msg: error.message };
  }
};
