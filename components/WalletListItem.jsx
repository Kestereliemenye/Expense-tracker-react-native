import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Typo from "./Typo";
import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import { Image } from "expo-image";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native"

import Animated,  { FadeInDown } from "react-native-reanimated";

const WalletListItem = ({ item, index, router }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={{ flex: 1 }}
            source={item?.image}
            contentFit="cover"
            transition={100}
          />
        </View>
        <View style={styles.nameContainer}>
          <Typo size={16}>{item?.name}</Typo>
          <Typo size={16} color={colors.neutral400}>
            ${item?.amount}
          </Typo>
        </View>
        <Icons.CaretRight
          size={verticalScale(20)}
          weight="bold"
        color={colors.white}/>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(17),
  },
  imageContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  nameContainer: {
    flex: 1,
    gap: 2,
    marginLeft: spacingX._10,
  },
});
