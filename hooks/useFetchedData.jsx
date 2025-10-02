import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore, auth } from "../config/firebase";

const useFetchedData = (collectionName, constraints = [], withUserFilter = true ) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    

    useEffect(() => {
      if (!collectionName) return;
      const currentUser = auth.currentUser;
      if (!currentUser && withUserFilter) {
        setData([]);
        setLoading(false);
        return;
      }
      const collectionRef = collection(firestore, collectionName);
      // ✅ auto-attach uid filter unless disabled
      const q = withUserFilter
        ? query(
            collectionRef,
            where("uid", "==", currentUser.uid),
            ...constraints
          )
        : query(collectionRef, ...constraints);

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const fecthedData = snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });

          setData(fecthedData);
          setLoading(false);
        },
        (err) => {
          console.log("Erro fetching Data:", err);
          setError(err.message);
          setLoading(false);
        }
      );
      return () => unsub();
    }, [collectionName, constraints, withUserFilter]);
  return ( {data,loading,error});
};


export default useFetchedData;

const styles = StyleSheet.create({});
