import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
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
import { limit, orderBy, where } from "firebase/firestore";
import useFetchedData from "../../hooks/useFetchedData";
import TransactionList from "../../components/TransactionList";

const SearchModal = () => {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
    const [search, setSearch] = useState("");
      const constraints = [
        where("uid", "==", user?.uid),
        orderBy("date", "desc"),
      ];
      const {
        data: allTransactions,
        error,
        loading: transactionLoading,
    } = useFetchedData("transactions", constraints);
    
    // to filter transctions
    const filteredTransactions = allTransactions.filter((item) => {
        if (search.length > 1) {
            if (
                item.category?.toLowerCase()?.includes(search?.toLowerCase()) ||
                item.type?.toLowerCase()?.includes(search?.toLowerCase()) ||
                item.description?.toLowerCase()?.includes(search?.toLowerCase())
            ) {
                return true
            }
            return false
        }
        return true // if no keyword show all transactions
    })

  return (
    <ModalWrapper style={{ backgroundColor: colors.neutral900 }}>
      <View style={styles.container}>
        <Header
          title={"Search"}
          leftIcon={<BackBtn />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* edit form */}
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="shoes..."
              value={search}
                          containerStyle={{ backgroundColor: colors.neutral800 }}
                          placeholderTextColor = {colors.neutral400}
              onChangeText={(value) => setSearch(value)}
            ></Input>
                  </View>
                  <View>
                      <TransactionList
                          loading={transactionLoading}
                          data={filteredTransactions}
                      emptyListMessage="No transaction match your search keyword"/>
                      
                  </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },

  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
