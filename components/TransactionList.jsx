import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { verticalScale, scale } from "@/utils/styling";
import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import { FlashList } from "@shopify/flash-list";
import Loading from "./Loading";
import { expenseCategories, incomeCategory } from "../constants/data";
import Animated, { FadeInDown } from "react-native-reanimated"


const TransactionList = ({ data, title, loading, emptyListMessage }) => {
  const handleClick = () => {
    // open transaction details in modal
  };
  return (
    <View style={styles.container}>
      {/* if title */}
      {title && (
        <Typo size={20} fontWeight={500}>
          {title}
        </Typo>
      )}

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          estimatedItemSize={60}
        />
      </View>
      {
        //   no loading screen and no data
        !loading && data.length === 0 && (
          <Typo
            size={15}
            color={colors.neutral400}
            style={{ textAlign: "center", marginTop: spacingY._15 }}
          >
            {emptyListMessage}
          </Typo>
        )
          }
          {
              loading && <View style={{ top: verticalScale(100) }}>
                  <Loading/>
              </View>
          }
    </View>
  );
};

const TransactionItem = ({ item, index, handleClick }) => {
  console.log("item:" , item)
  let category = expenseCategories["airtime"]
  
  const IconComponent = category.icon;
  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(14)}>
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent size={verticalScale(25)} weight="fill" color={colors.white}>
            </IconComponent>
          )}
        </View>


        <View style={styles.categoryDes}>
          <Typo size={17}>{category.label}</Typo>
          <Typo size={12} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>Bought some apples</Typo>
        </View>


        <View style={styles.amountDates}>
          <Typo fontWeight={"500"} color={colors.rose}>- $14</Typo>
          <Typo size={13} color={colors.neutral400}> 12 jan</Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  list: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    // list with background
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },

  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve:"continuous"
  },
  categoryDes: {
    flex: 1,
    gap: 2.5,
  },
  amountDates: {
    alignItems: "flex-end",
    gap: 3,
  },
});
