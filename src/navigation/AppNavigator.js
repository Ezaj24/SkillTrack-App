// src/navigation/AppNavigator.js

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import BottomTabNavigator from "./BottomTabNavigator";

import AddSkillScreen from "../screens/AddSkillScreen";
import UpdateSkillScreen from "../screens/UpdateSkillScreen";
import AddGoalScreen from "../screens/AddGoalScreen";
import UpdateGoalScreen from "../screens/UpdateGoalScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade", // smoother, less white flash
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Detail screens (no tab bar) */}
      <Stack.Screen name="AddSkill" component={AddSkillScreen} />
      <Stack.Screen name="UpdateSkill" component={UpdateSkillScreen} />
      <Stack.Screen name="AddGoal" component={AddGoalScreen} />
      <Stack.Screen name="UpdateGoal" component={UpdateGoalScreen} />
    </Stack.Navigator>
  );
}
