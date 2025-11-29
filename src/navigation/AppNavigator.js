// src/navigation/AppNavigator.js

import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import BottomTabNavigator from "./BottomTabNavigator";

import AddSkillScreen from "../screens/AddSkillScreen";
import UpdateSkillScreen from "../screens/UpdateSkillScreen";
import AddGoalScreen from "../screens/AddGoalScreen";
import UpdateGoalScreen from "../screens/UpdateGoalScreen";

import { ThemeContext } from "../theme/ThemeContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",

        // Eliminates white flash
        contentStyle: {
          backgroundColor: darkMode ? "#000000" : "#f4f4f7",
        },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Main app */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Detail screens */}
      <Stack.Screen name="AddSkill" component={AddSkillScreen} />
      <Stack.Screen name="UpdateSkill" component={UpdateSkillScreen} />
      <Stack.Screen name="AddGoal" component={AddGoalScreen} />
      <Stack.Screen name="UpdateGoal" component={UpdateGoalScreen} />
    </Stack.Navigator>
  );
}
