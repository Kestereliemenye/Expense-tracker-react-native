import { Dimensions, Platform , StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {colors} from "@/constants/theme"

const { height } = Dimensions.get("window");

const ScreenWrapper = ({style, children}) => {
    let paddingTop = Platform.OS === "ios" ? height * 0.06 : 0;
  return (
      <View style={[{
          paddingTop,
          flex: 1,
          backgroundColor: colors.neutral900
      },style]}>
          <StatusBar barstyle="light-content" backgroundColor={colors.neutral900}/>
          {children}
    </View>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({})