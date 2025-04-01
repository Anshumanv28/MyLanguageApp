import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import HomeScreen from "../home";
import GamesScreen from "../games";
import LearnScreen from "../learn";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const theme = useTheme();
  console.log("Theme:", theme);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Games":
              iconName = "game-controller-outline";
              break;
            case "Learn":
              iconName = "book-outline";
              break;
            default:
              iconName = "help-circle-outline";
          }

          return (
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          height: 60,
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
    </Tab.Navigator>
  );
}
