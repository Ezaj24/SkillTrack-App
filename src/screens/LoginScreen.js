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
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const token = res.data.token;

      await AsyncStorage.setItem("token", token);
      setAuthToken(token);

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);
      alert("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.title, { color: Colors.textDark }]}>
        Welcome Back
      </Text>
      <Text style={[styles.subtitle, { color: Colors.textMedium }]}>
        Login to continue
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: Colors.card, borderColor: Colors.border, color: Colors.textDark },
        ]}
        placeholder="Email"
        placeholderTextColor={Colors.textLight}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <View
        style={[
          styles.passwordRow,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <TextInput
          style={[styles.passwordInput, { color: Colors.textDark }]}
          placeholder="Password"
          placeholderTextColor={Colors.textLight}
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Feather
            name={showPass ? "eye" : "eye-off"}
            size={22}
            color={Colors.textMedium}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.primary }]}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={[styles.link, { color: Colors.primary }]}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80 },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { marginTop: 6, marginBottom: 26, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 22,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    fontSize: 15,
  },
});
