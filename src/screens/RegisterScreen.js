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
      alert("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/register", {
        userName,
        email,
        password,
      });

      alert("Registration successful!");
      navigation.navigate("Login");
    } catch (err) {
      alert("Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <Text style={[styles.header, { color: Colors.textDark }]}>
        Create Account
      </Text>
      <Text style={[styles.sub, { color: Colors.textLight }]}>
        Start your skill journey today.
      </Text>

      {/* NAME */}
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <Feather name="user" size={20} color={Colors.textMedium} />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor={Colors.textLight}
          style={[styles.input, { color: Colors.textDark }]}
          value={userName}
          onChangeText={setUserName}
        />
      </View>

      {/* EMAIL */}
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

      {/* PASSWORD */}
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

      {/* REGISTER BUTTON */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.primary }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={[styles.link, { color: Colors.primary }]}>
          Already have an account? Log In →
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
