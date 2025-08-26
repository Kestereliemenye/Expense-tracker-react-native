import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from "@/components/ScreenWrapper"
import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { verticalScale } from "@/utils/styling";
import Header from "../../components/header";
import BackBtn from "@/components/BackBtn";
import { useAuth } from "../../context/authContext"
import  * as Icons from "phosphor-react-native"
import { useRouter } from 'expo-router';

const Wallet = () => {
  const router = useRouter()
  //func to calculate total balance
  const getTotalBalance = () => {
    return 3450;
  }
  return (
    <ScreenWrapper style={{backgroundColor: colors.black}}>
      <View style={styles.container}>
        {/* Balance view */}
        <View style={styles.balancedView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>${getTotalBalance()?.toFixed(2)}</Typo>
            <Typo size={16} color={colors.neutral300}>Total balance</Typo>
          </View>
        </View>
        {/* wallets view */}
        <View style={styles.wallets}>
          {/* Header */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>My Wallets</Typo>
            <TouchableOpacity onPress={() => router.push("/(modals)/walletModal")}>
              <Icons.PlusCircleIcon
                weight='fill'
                color={colors.primary}
              size={verticalScale(33)}/>

            </TouchableOpacity>
          </View>

          {/* todo: wallet lists */}
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:"space-between"
  },
  balancedView:{
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems:"center"
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25
  },
  listStyle: {
    paddingHorizontal: spacingY._20,
    paddingTop: spacingY._15
  }
})