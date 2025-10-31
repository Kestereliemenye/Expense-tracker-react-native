import { StyleSheet } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import CustomTabs from "@/components/CustomTabs";

export default function Layout() {
  return (
    <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="statistics" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
