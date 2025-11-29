// src/screens/SplashScreen.js

import React, { useEffect, useRef, useContext } from "react";
import { Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../api/api";
import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

export default function SplashScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("token");

    setTimeout(() => {
      if (token) {
        setAuthToken(token);
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    }, 1500);
  };

  return (
    <LinearGradient
      colors={darkMode ? ["#000000", "#050714"] : ["#0d1b3d", "#1976d2"]}
      style={styles.container}
    >
      <Animated.Text style={[styles.logo, { opacity: fade }]}>
        SkillTrack
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fade }]}>
        Track. Grow. Achieve.
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: {
    fontSize: 42,
    fontWeight: "700",
    color: "white",
    letterSpacing: 1.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#d0e4ff",
  },
});
