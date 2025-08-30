import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "../config/firebase";

const useFetchedData = (collectionName, contraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    

    useEffect(() => {
        if (!collectionName) return;
        const collectionRef = collection(firestore, collectionName)
        const q = query(collectionRef, ...contraints)



        const unsub = onSnapshot(q, (snapshot) => {
            const fecthedData = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })

            setData(fecthedData);
            setLoading(false)
        }, (err) => {
            console.log( "Erro fetching Data:", err);
            setError(err.message)
            setLoading(false)
            
        })
        return ()=> unsub()

        
    },[])
  return ( {data,loading,error});
};


export default useFetchedData;

const styles = StyleSheet.create({});
