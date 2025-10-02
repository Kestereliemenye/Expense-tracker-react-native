import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackBtn from "@/components/BackBtn";
import Input from "@/components/input";
import Button from "@/components/Button";
import * as Icons from "phosphor-react-native";
import { useAuth } from "../../context/authContext";

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign up", "Please fill all fields");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(false);
    if (!res.success) {
      Alert.alert("Sign up ", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0} // adjust this value if keyboard still overlaps
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* back button */}
          <BackBtn iconSize={28} />
          <View style={{ gap: 5, marginTop: spacingY._20 }}>
            <Typo size={30} fontWeight={"800"}>
              Let`s
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              Get Started
            </Typo>
          </View>

          {/* form */}
          <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
              Create an account to track all your expenses
            </Typo>

            <Input
              placeholder="Enter your name"
              onChangeText={(value) => (nameRef.current = value)}
              icon={
                <Icons.User
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />

            <Input
              placeholder="Enter your email"
              onChangeText={(value) => (emailRef.current = value)}
              icon={
                <Icons.At
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />

            <Input
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={(value) => (passwordRef.current = value)}
              icon={
                <Icons.Lock
                  size={verticalScale(26)}
                  color={colors.neutral300}
                  weight="fill"
                />
              }
            />

            <Button loading={isLoading} onPress={handleSubmit}>
              <Typo fontWeight={"700"} color={colors.black} size={21}>
                Sign up
              </Typo>
            </Button>
          </View>

          {/* footer */}
          <View style={styles.footer}>
            <Typo size={15}>Already have an account ?</Typo>
            <Pressable onPress={() => router.replace("/(auth)/login")}>
              <Typo fontWeight={"700"} color={colors.primary} size={15}>
                Login
              </Typo>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: spacingY._20,
  },
});
