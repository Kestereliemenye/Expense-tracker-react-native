import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore, auth } from "../config/firebase";

const useFetchedData = (
  collectionName,
  constraints = [],
  withUserFilter = true
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;
    const currentUser = auth.currentUser;
    // console.log("[useFetchedData] currentUser:", currentUser);
    if (withUserFilter && !currentUser) {
      setData([]);
      setLoading(false);
      return;
    }
    let q;
    try {
      const collectionRef = collection(firestore, collectionName);
      q = withUserFilter
        ? query(
            collectionRef,
            where("uid", "==", currentUser.uid),
            ...constraints
          )
        : query(collectionRef, ...constraints);
      // console.log("[useFetchedData] Query:", q);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.log("[useFetchedData] Query error:", err);
      // return;
    }

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        // console.log("[useFetchedData] Snapshot size:", snapshot.size);
        const fetchedData = snapshot.docs.map((doc) => {
          const docData = doc.data();
          // console.log("[useFetchedData] Doc:", doc.id, docData);
          return {
            id: doc.id,
            ...docData,
          };
        });
        setData(fetchedData);
        setLoading(false);
      },
      (err) => {
        console.log("[useFetchedData] Error fetching Data:", err);
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [collectionName, constraints, withUserFilter]);

  return { data, loading, error };
};

export default useFetchedData;

const styles = StyleSheet.create({});
