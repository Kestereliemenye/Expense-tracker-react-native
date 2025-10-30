import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CustomTabs({ state, descriptors, navigation }) {
  const tabbarIcons = {
    index: (isFocused) => (
      <Icons.House
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    statistics: (isFocused) => (
      <Icons.ChartBar
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    wallet: (isFocused) => (
      <Icons.Wallet
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFocused) => (
      <Icons.User
        size={verticalScale(30)}
        weight={isFocused ? "fill" : "regular"}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
  };
  return (
    <View style={styles.tabar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            // href={buildHref(route.name, route.params)}
            key={route.key}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabar: {
    flexDirection: "row",
    width: "100%",
<<<<<<< HEAD
    height: Platform.OS === "ios" ? verticalScale(80) : verticalScale(120),
=======
    height: Platform.OS === "ios" ? verticalScale(80) : verticalScale(80),
>>>>>>> 85de852740a6589ecbcbb90ce323dfa94dd73642
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
  },
  tabBarItem: {
<<<<<<< HEAD
    marginBottom: Platform.OS === "ios" ? spacingY._30 : spacingY._40,
=======
    marginBottom: Platform.OS === "ios" ? spacingY._30 : spacingY._10,
>>>>>>> 85de852740a6589ecbcbb90ce323dfa94dd73642
    justifyContent: "center",
    alignItems: "center",
  },
});
