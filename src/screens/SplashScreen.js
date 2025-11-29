// src/screens/SplashScreen.js

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function SplashScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        speed: 0.6,
        bounciness: 10,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate only after animation finishes
      navigation.replace("Login");
    });
  }, [fade, scale, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, transform: [{ scale }] }}>
        <Text style={styles.logo}>SkillTrack</Text>
        <Text style={styles.tagline}>Build. Improve. Achieve.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617", // dark navy, premium feel
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#4A90E2", // brand blue
  },
  tagline: {
    fontSize: 14,
    marginTop: 8,
    letterSpacing: 0.5,
    color: "#9ca3af",
  },
});
