// src/screens/LoginScreen.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, setAuthToken } from "../api/api";

import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

export default function LoginScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", { email, password });

      const token = res.data?.token;
      if (token) {
        await AsyncStorage.setItem("token", token);
        setAuthToken(token);
        navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
      } else {
        alert("Invalid login response");
      }
    } catch (err) {
      alert("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.header, { color: Colors.textDark }]}>
        Welcome Back 👋
      </Text>
      <Text style={[styles.sub, { color: Colors.textLight }]}>
        Log in to continue your growth journey.
      </Text>

      {/* Email */}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <Feather name="mail" size={20} color={Colors.textMedium} />
        <TextInput
          placeholder="Email"
          placeholderTextColor={Colors.textLight}
          style={[styles.input, { color: Colors.textDark }]}
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <Feather name="lock" size={20} color={Colors.textMedium} />
        <TextInput
          placeholder="Password"
          placeholderTextColor={Colors.textLight}
          style={[styles.input, { color: Colors.textDark }]}
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Feather
            name={showPass ? "eye-off" : "eye"}
            size={20}
            color={Colors.textMedium}
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.primary }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      {/* Register redirect */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[styles.link, { color: Colors.primary }]}>
          Don't have an account? Sign Up →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 120 },
  header: { fontSize: 32, fontWeight: "800" },
  sub: { fontSize: 14, marginTop: 8 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginTop: 18,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
  },

  button: {
    marginTop: 26,
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});
