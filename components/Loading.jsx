import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

export default function Loading({ size = "large", color = colors.primary }) {
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <ActivityIndicator size={size} color={color}/>
    </View>
  );
}

const styles = StyleSheet.create({});
