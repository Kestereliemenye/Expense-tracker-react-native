// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// to create auth service
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyAe6DDLPJ_GMAMGZrEOXYbDrjrEfijJeTc",
  authDomain: "expense-tracker-fe301.firebaseapp.com",
  projectId: "expense-tracker-fe301",
  storageBucket: "expense-tracker-fe301.firebasestorage.app",
  messagingSenderId: "622961147560",
  appId: "1:622961147560:web:cd38c6f7788851b0970c9d",
  measurementId: "G-W63LL8P720",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app)

