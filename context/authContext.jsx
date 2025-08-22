import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../config/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

const AuthContext = createContext(null);

// auth provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    
    useEffect(() => {
        // to know if user is logged in to change page
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // if user is logged in
                setUser({
                    uid: firebaseUser?.uid,
                    email: firebaseUser?.email,
                    name: firebaseUser?.displayName
                })
                router.replace("/(tabs)")

            } else {

                //no user, if user is logged out 
                setUser(null)
                router.replace("/(auth)/welcome")
            }
            
        })
        return() => unsub()
    }, [])

  // login function
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { succes: true };
    } catch (error) {
      let msg = error.message;
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
      return { success: false, msg };
    }
  };
  const updateUserDate = async (uid) => {
    try {
      // 1. Create a reference to the user document in Firestore
      const docRef = doc(firestore, "users", uid);
      // 2. Fetch the document data from Firestore
      const docSnap = await getDoc(docRef);
      // 3. Check if the document actually exists
      if (docSnap.exists()) {
        // .4 get the actual data (name, email, etc)
        const data = docSnap.data();
        //.5 create a clean object with the selected fields
        const userData = {
          uid: data.uid,
          email: data.email || null,
          name: data.name || null,
          image: data.image || null,
        };
        // update react state  so the app knows who the user is
        setUser({ ...userData });
      }
    } catch (error) {
      let msg = error.message;
      //    return { success: false, msg };
      console.log("error", error);
    }
  };

  const contextValue = {
    user,
    setUser,
    login,
    register,
    updateUserDate,
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
