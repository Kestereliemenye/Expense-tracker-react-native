import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../config/firebase";
import { setDoc, doc, getDoc , onSnapshot} from "firebase/firestore";
import { useRouter } from "expo-router";

const AuthContext = createContext(null);

// auth provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    const router = useRouter();
    
   useEffect(() => {
     let unsubUser = null;

     const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
       if (firebaseUser) {
         const userRef = doc(firestore, "users", firebaseUser.uid);

         // Listen for realtime changes to the user's document
         unsubUser = onSnapshot(userRef, (snapshot) => {
           if (snapshot.exists()) {
             const data = snapshot.data();

             setUser({
               uid: data.uid,
               email: data.email || null,
               name: data.name || null,
               image: data.image || null,
             });
           }
         });

         router.replace("/(tabs)");
       } else {
         setUser(null);
         router.replace("/(auth)/welcome");
       }
     });

     return () => {
       unsubAuth();

       if (unsubUser) {
         unsubUser();
       }
     };
   }, []);
  
  // login function
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { succes: true };
    } catch (error) {
      let msg = error.message;
      console.log("error message: ", msg);
      if (msg.includes("(auth/invalid-credential)")) msg = "Wrong credentials";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
        return { success: false, msg };
    }
  };

  // register user
  const register = async (email, password, name) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });
      return { succes: true };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("(auth/weak-password)"))
        msg = "Password should be at least 8 characters";
      if (msg.includes("(auth/email-already-in-use)"))
        msg = "This email is already in use";
      if (msg.includes("(auth/weak-password)"))
        msg = "Password should be at least 8 characters";

      console.log("error message: ", msg);

      return { success: false, msg };
    }
  };


  const contextValue = {
    user,
    setUser,
    login,
    register,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
