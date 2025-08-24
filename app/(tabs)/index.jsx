import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { signOut } from 'firebase/auth';
import {auth} from "@/config/firebase"
import { useAuth } from '../../context/authContext';
import ScreenWrapper from "@/components/ScreenWrapper"




const Home = () => {
  const handleLogout = async () => {
    await signOut(auth)
  }
  // const { user } = useAuth()
  // console.log("user:" , user);
  
  return (
    <ScreenWrapper>
      <Typo>Home</Typo>
      {/* <Button onPress={handleLogout}>
        <Typo color={colors.black}>Logout</Typo>
      </Button> */}
    </ScreenWrapper>
  );
}

export default Home

const styles = StyleSheet.create({})