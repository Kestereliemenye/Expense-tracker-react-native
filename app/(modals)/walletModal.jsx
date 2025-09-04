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
import { createOrUpdateWallet, deletewallet } from "../../services/walletService";

const WalletModal = () => {
  const { user, updateUserData } = useAuth();
  const [wallet, setWallet] = useState({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const oldWallet = useLocalSearchParams();

  useEffect(() => {
    // to check is old wallet exists
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image,
      });
    }
  }, []);

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

    //include wallet id if updating wallet
    if (oldWallet?.id) data.id = oldWallet?.id;

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


  // delete function
  const onDelete = async () => {
    // console.log("deleing the wallet: ", oldWallet?.id);
    if (!oldWallet?.id) return;
    setLoading(true)
    const res = await deletewallet(oldWallet?.id)
    setLoading(false)

    if (res.success) {
      router.back()
    } else {
      Alert.alert("wallet", res.msg)
    }
    
  }

  // delete alert
  const showDeleteAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to do this? \n This action will remove all transaction related to this wallet",
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
  }


  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
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

        {
          oldWallet?.id && !loading && (
            <Button
              onPress={showDeleteAlert}
              style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15
            }}>
              <Icons.Trash color={colors.white} size={verticalScale(24)} weight="bold" />
            </Button>
          )
        }
        <Button loading={loading} onPress={submit} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {oldWallet?.id ? "Update Wallet" : " Add wallet"}
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
