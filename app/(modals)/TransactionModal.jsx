import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import { verticalScale, scale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "../../components/header";
import BackBtn from "../../components/BackBtn";
import * as Icons from "phosphor-react-native";
import Typo from "../../components/Typo";
import Input from "../../components/input";
import Button from "../../components/Button";
import { useAuth } from "../../context/authContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import ImageUpload from "../../components/imageUpload";
import {
  createOrUpdateWallet,
  deletewallet,
} from "../../services/walletService";
import { Dropdown } from "react-native-element-dropdown";
import { expenseCategories, transactionTypes } from "../../constants/data";
import useFetchedData from "../../hooks/useFetchedData";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createOrUpdateTransaction } from "../../services/transactionService";

const TransactionModal = () => {
  const { user } = useAuth();
  const [transaction, setTransaction] = useState({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  // to get wallets
  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useFetchedData("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"), // order the wallet by creation date from current to oldest
  ]);

  const oldTransaction = useLocalSearchParams();
  // console.log("old wallet", oldTransaction);

  // useEffect(() => {
  //   // to check is old wallet exists
  //   if (oldTransaction?.id) {
  //     setTransaction({
  //       name: oldTransaction?.name,
  //       image: oldTransaction?.image,
  //     });
  //   }
  // }, []);

  const submit = async () => {
    const {type,amount,description,category,date,walletId,image} = transaction
    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the fields")
      return;
    }


    let transactionData = {
      type,
      amount,
      description,
      category,
      walletId,
      image,
      uid: user?.uid
    }

    // todo include transaction id 
    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData)

    setLoading(false)
    if (res.success) {
      router.back()
    } else {
      Alert.alert("Transaction", res.msg)
    }
    
    
  };

  // on chnage date function
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });

    setShowDatePicker(Platform.OS === "ios" ? true : false);
  };

  // delete function
  const onDelete = async () => {
    // console.log("deleing the wallet: ", oldTransaction?.id);
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deletewallet(oldTransaction?.id);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("wallet", res.msg);
    }
  };

  // delete alert
  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to do this? \n This action will remove all transaction related to this wallet",
      // options
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "New Transactions"}
          leftIcon={<BackBtn />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* edit form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Type
            </Typo>
            {/* Dropdown */}
            <Dropdown
              style={styles.dropDownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
              itemTextStyle={styles.dropDownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
            />
          </View>

          {/* Wallet option */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Wallet
            </Typo>
            {/* Dropdown */}
            <Dropdown
              style={styles.dropDownContainer}
              activeColor={colors.neutral700}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              // mapp through to get wallets
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} ($${wallet.amount})`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={transaction.walletId}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
              itemTextStyle={styles.dropDownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder={"Select Wallet"}
            />
          </View>

          {/* to show expense categories*/}
          {transaction.type === "expense" && (
            <View style={styles.inputContainer}>
              <Typo color={colors.neutral200} size={16}>
                Expense Category
              </Typo>
              {/* Dropdown */}
              <Dropdown
                style={styles.dropDownContainer}
                activeColor={colors.neutral700}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                iconStyle={styles.dropdownIcon}
                // mapp through to get wallets
                data={Object.values(expenseCategories)} // get only values from the object
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={transaction.category}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
                itemTextStyle={styles.dropDownItemText}
                itemContainerStyle={styles.dropdownItemContainer}
                containerStyle={styles.dropdownListContainer}
                placeholder={"Select Wallet"}
              />
            </View>
          )}

          {/* Date picker component */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Typo size={14}> {transaction.date.toLocaleDateString()}</Typo>
              </Pressable>
            )}
            {showDatePicker && (
              <View style={Platform.OS === "ios" && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date}
                  textColor={colors.white}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onDateChange}
                />
                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={"500"}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )}
                {}
              </View>
            )}
          </View>

          {/* amount */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>
              Amount
            </Typo>
            <Input
              // placeholder="Salary"
              keyboardType="numeric"
              value={transaction.amount.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            ></Input>
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo size={16} color={colors.neutral200}>
                Description
              </Typo>
              <Typo size={14} color={colors.neutral500}>
                (optional)
              </Typo>
            </View>
            <Input
              // placeholder="Salary"
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection: "row",
                height: verticalScale(100),
                alignItems: "flex-start",
                paddingVertical: 15,
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
              }
            ></Input>
          </View>

          {/* receipt */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo size={16} color={colors.neutral200}>
                Receipt
              </Typo>
              <Typo size={14} color={colors.neutral500}>
                (optional)
              </Typo>
            </View>
            <ImageUpload
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              onClear={() => setTransaction({ ...transaction, image: null })}
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button loading={loading} onPress={submit} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingX._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropdown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    // flexDirection:"row"
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {
    // backgroundColor:"red"
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropDownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  dropDownItemText: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral400,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
});
