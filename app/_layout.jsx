import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(modals)/profileModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/walletModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/transactionModal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/searchModal"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </AuthProvider>
  );
}
