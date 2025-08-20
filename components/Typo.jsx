import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

export default function Typo({
  size,
  color = colors.text,
  fontWeight = " 400",
  children,
  style,
  textProps = {},
}) {
  const textStyles = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };
  return (
    <Text style={[textStyles, style]} {...textProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({});
