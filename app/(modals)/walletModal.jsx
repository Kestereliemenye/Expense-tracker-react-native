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
import { useRouter } from "expo-router";
import ImageUpload from "../../components/imageUpload";
import { createOrUpdateWallet } from "../../services/walletService";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  const submit = async () => {
    let { name, image } = wallet;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields");
      return;
    }
    const data = {
      name,
      image,
      uid: user?.uid,
    };

    //todo: include wallet id if updating wallet
    setLoading(true);
    const res = await createOrUpdateWallet(data);
    setLoading(false);


    if (res.success) {
      /// updateUser
      updateUserData(user?.uid);
      router.back();
    } else {
      Alert.alert("Wallet", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="New Wallet"
          leftIcon={<BackBtn />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* edit form */}
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            ></Input>
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            {/* Image picker */}
            <ImageUpload
              file={wallet.image}
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              onClear={() => setWallet({ ...wallet, image: null })}
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Button loading={loading} onPress={submit} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            Add wallet
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
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
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
    borderWidth: 1,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  inputContainer: {
    gap: spacingY._10,
  },
});
