import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function index() {
  // to make the splash page redirect
  // const router = useRouter();
  //   useEffect(() => {
  //       setTimeout(() => {
  //         router.push("./(auth)/welcome")
  //     },2000)
  // }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/splash.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});
