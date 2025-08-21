import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import {useRouter} from "expo-router"
import  ScreenWrapper  from '@/components/ScreenWrapper'
import Typo from "@/components/Typo"
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import BackBtn from '@/components/BackBtn';
import Input from "@/components/input";
import Button from "@/components/Button"
import * as Icons from "phosphor-react-native"

const Login = () => {
    const emailRef = useRef("");
    const passwordRef = useRef("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const handleSubmit = async ()=> {

    }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* back button */}
        <BackBtn iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>
        {/* form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            {" "}
            Login now to track all your expenses
          </Typo>
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
            <Typo size={14} color={colors.text} style={{alignSelf: "flex-end"}}>Forgot Password?</Typo>

                  <Button loading={isLoading} onPress={handleSubmit}>
                      <Typo fontWeight={"700"} color={colors.black} size={21}>Login</Typo>
            </Button>
              </View>
              {/* {footer} */}
              <View style={styles.footer}>
                  <Typo size={15}>Don`t have an account ?</Typo>
                  <Pressable onPress={() => router.push("/(auth)/register")}>
                      <Typo fontWeight={"700"} color={colors.primary} size={15}>Sign up</Typo>
                  </Pressable>
              </View>
      </View>
    </ScreenWrapper>
  );
}
export default Login
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20
    },
    welcomeText: {
        fontsize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text,
    },
    form: {
        gap: spacingY._20,
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
        color: colors.text,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap:5
    },
    footerText: {
        textAlign: "center",
        color: colors.red,
        fontSize:verticalScale(15)

    }
})