import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Typo from "./Typo"
import {colors} from "@/constants/theme"

const Header = ({title = "",leftIcon, style}) => {
  return (
      <View style={[styles.container, style]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          {
              title && (
                  <Typo
                      size={22}
                      fontWeight={"60"}
                      style={{
                          textAlign: "center",
                          //if the left icon shows reduce the width
                          width: leftIcon? "82%" : "100%"
                      }}
                  >
                      {title}
                  </Typo>
              )
          }
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        flexDirection: "row"
        
    },
    leftIcon: {
        alignSelf:"flex-start"
        
    }
})