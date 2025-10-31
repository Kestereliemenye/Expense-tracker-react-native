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
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
        setLoading(false);
      },
      (err) => {
        console.log("Error fetching Data:", err);
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
