// src/screens/RegisterScreen.js

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
import { api } from "../api/api";
import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

export default function RegisterScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!userName.trim() || !email.trim() || !password.trim()) {
      alert("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        userName,
        email,
        password,
      });
      alert("Registered successfully. Please login.");
      navigation.navigate("Login");
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data || err.message);
      alert("Failed to register");
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.title, { color: Colors.textDark }]}>Register</Text>
      <Text style={[styles.subtitle, { color: Colors.textMedium }]}>
        Create your SkillTrack account
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: Colors.card, borderColor: Colors.border, color: Colors.textDark },
        ]}
        placeholder="Name"
        placeholderTextColor={Colors.textLight}
        value={userName}
        onChangeText={setUserName}
      />

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
        onPress={handleRegister}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={[styles.link, { color: Colors.primary }]}>
          Already have an account? Login
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
