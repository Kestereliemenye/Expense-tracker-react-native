import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Header from "../../components/header";
import { useAuth } from "../../context/authContext";
import { getProfileImage } from "../../services/imageServices";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const accountOptions = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <Icons.GearSix size={26} color={colors.white} weight="fill" />,
      // routeName: "/(models/profileModel)",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.Lock size={26} color={colors.white} weight="fill" />,
      // routeName: "/(models/profileModel)",
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <Icons.Power size={26} color={colors.white} weight="fill" />,
      // routeName: "/(models/profileModel)",
      bgColor: "#e11d48",
    },
  ];

  // logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  // to show logout alert
  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel logout"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };

  // Handle press function
  const handlePress = (item) => {
    // console.log(`i clicked ${item.title} button`);

    if (item.title === "Logout") {
      showLogoutAlert();
    }
    if (item.routeName) router.push(item.routeName);
    // console.log(item.routeName);
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* header */}
        <Header title="Profile" style={{ marginVertical: spacingY._10 }} />

        {/* user info */}
        <View style={styles.userInfo}>
          {/* Avatar */}
          <View>
            {/* user image */}
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* Name and email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* account options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => {
            return (
              <Animated.View
                key={index.toString()}
                entering={FadeInDown}
                style={styles.listItem}
              >
                <TouchableOpacity
                  onPress={() => handlePress(item)}
                  style={styles.flexRow}
                >
                  {/* icon */}
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: item?.bgColor },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                    {item?.title}
                  </Typo>
                  <Icons.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
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
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._10,
  },
});
