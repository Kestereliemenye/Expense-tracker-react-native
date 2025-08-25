import { Alert, ScrollView, StyleSheet,  TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import { verticalScale, scale } from "@/utils/styling";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "../../components/header";
import BackBtn from "../../components/BackBtn";
import {Image} from "expo-image";
import {getProfileImage}  from "../../services/imageServices";
import *as Icons from "phosphor-react-native"
import Typo from "../../components/Typo";
import Input from "../../components/input"
import Button from "../../components/Button"
import { useAuth } from "../../context/authContext";
import { updateUser } from "../../services/userService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker"

const ProfileModal = () => {
  const { user , updateUserData} = useAuth();
  const [userData, setUserData ] = useState({
    name: "",
    image: null
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // fills the name and image with data fromd ata base wehn the modal opens
  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null
    })
  }, [])


  // to pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5
    })


    if (!result.canceled) {
      setUserData({...userData, image: result.assets[0]})
    }
    
  }

  const submit = async () => {
    let { name, image } = userData;
    if (!name.trim()) {
      Alert.alert("User", "Please fill all the fields")
      return;
    }
    setLoading(true)
    console.log("goood to go");
    const res = await updateUser(user?.uid, userData)
    setLoading(false);
    if (res.success) {
      /// updateUser
      updateUserData(user?.uid)
      router.back()
    } else {
      Alert.alert("User", res.msg)
    }
    
    
  }



  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackBtn />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* edit form */}
        <ScrollView contentContainerStyle={styles.form}>
          {/* avatar container */}
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />
            {/* edit icon btn */}
            <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
              <Icons.Pencil size={verticalScale(20)} color={colors.neutral800}/>

            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Name</Typo>
          </View>
          <Input placeHolder="name" value={userData.name} onChangeText={(value) => setUserData({...userData, name:value})} ></Input>
        </ScrollView>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Button loading={loading} onPress={submit} style={{ flex:1}}>
          <Typo color={colors.black} fontWeight={"700"}>Update</Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

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
