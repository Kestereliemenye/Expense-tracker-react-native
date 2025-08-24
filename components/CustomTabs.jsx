import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors, spacingX, spacingY} from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native"


export default function CustomTabs({ state, descriptors, navigation }) {
    const tabbarIcons = {
        index: (isFocused) => (
        <Icons.House
            size={verticalScale(30)}
            weight={isFocused ? "fill" : "regular"}
            color={isFocused? colors.primary: colors.neutral400 }
        />
        
        ),
          statistics: (isFocused) => (
        <Icons.ChartBar
            size={verticalScale(30)}
            weight={isFocused ? "fill" : "regular"}
            color={isFocused? colors.primary: colors.neutral400 }
        />
        
          ),
            wallet: (isFocused) => (
        <Icons.Wallet
            size={verticalScale(30)}
            weight={isFocused ? "fill" : "regular"}
            color={isFocused? colors.primary: colors.neutral400 }
        />
        
            ),
              profile: (isFocused) => (
        <Icons.User
            size={verticalScale(30)}
            weight={isFocused ? "fill" : "regular"}
            color={isFocused? colors.primary: colors.neutral400 }
        />
        
              )
}
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
                {
                    tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)
           }
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
        height: Platform.OS == "ios" ? verticalScale(80) : verticalScale(75),
        backgroundColor: colors.neutral800,
        justifyContent: "space-around",
        alignItems: "center",
        borderTopColor: colors.neutral700
    },
    tabBarItem:{
        marginBottom: Platform.OS == "ios" ? spacingY._30 : spacingY._25,
        justifyContent: "center",
        alignItems:"center"
     }
})
