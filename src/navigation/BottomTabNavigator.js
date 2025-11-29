// src/navigation/BottomTabNavigator.js

import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import SkillsScreen from "../screens/SkillsScreen";
import GoalsScreen from "../screens/GoalsScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 60,
          backgroundColor: Colors.card,
          borderTopWidth: 0,
          elevation: 16,
          shadowColor: Colors.shadow,
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -4 },
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          paddingBottom: 6,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="home"
              size={26}
              color={focused ? Colors.primary : Colors.textLight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Skills"
        component={SkillsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="layers"
              size={26}
              color={focused ? Colors.primary : Colors.textLight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="target"
              size={26}
              color={focused ? Colors.primary : Colors.textLight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="user"
              size={26}
              color={focused ? Colors.primary : Colors.textLight}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
