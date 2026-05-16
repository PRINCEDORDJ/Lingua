import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 70;

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  // Filter out routes that shouldn't be in the tab bar
  const visibleRoutes = state.routes.filter((route: any) => {
    const { options } = descriptors[route.key];
    return options.href !== null;
  });

  const activeVisibleIndex = visibleRoutes.findIndex(
    (route: any) => route.key === state.routes[state.index].key
  );

  const tabWidth = width / visibleRoutes.length;
  const translateX = useSharedValue((activeVisibleIndex >= 0 ? activeVisibleIndex : 0) * tabWidth);

  useEffect(() => {
    translateX.value = withSpring((activeVisibleIndex >= 0 ? activeVisibleIndex : 0) * tabWidth, {
      damping: 20,
      stiffness: 150,
      mass: 1,
    });
  }, [activeVisibleIndex, tabWidth]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        { 
          paddingBottom: insets.bottom, 
          height: TAB_BAR_HEIGHT + insets.bottom,
        },
      ]}
      className="bg-neutral-white border-t border-neutral-gray200"
    >
      {/* Animated Circle */}
      <Animated.View
        style={[
          styles.activeCircleContainer,
          { width: tabWidth },
          animatedCircleStyle,
        ]}
      >
        <View 
          style={styles.activeCircle} 
          className="bg-purple-dark shadow-sm" 
        />
      </Animated.View>

      {/* Tabs */}
      {visibleRoutes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = activeVisibleIndex === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const iconName = getIconName(route.name, isFocused);
        const label = options.title !== undefined ? options.title : route.name;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName as any}
                size={26}
                color={isFocused ? "#FFFFFF" : "#AFB6BB"}
              />
              {!isFocused && (
                <Text
                  style={styles.label}
                  className="text-[10px] font-bold mt-1 uppercase"
                >
                  {label}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getIconName = (routeName: string, isFocused: boolean) => {
  switch (routeName) {
    case "index":
      return isFocused ? "home" : "home-outline";
    case "learn":
      return isFocused ? "book" : "book-outline";
    case "ai-teacher":
      return isFocused ? "school" : "school-outline";
    case "chat":
      return isFocused ? "chatbubble" : "chatbubble-outline";
    case "profile":
      return isFocused ? "person" : "person-outline";
    default:
      return "help-circle";
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFFFFF",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  activeCircleContainer: {
    position: "absolute",
    top: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  activeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#5D3FD3", // Using the purple from layout
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: TAB_BAR_HEIGHT,
    zIndex: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#AFB6BB",
  },
});
