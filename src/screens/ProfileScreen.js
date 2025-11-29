// src/screens/ProfileScreen.js

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { api, setAuthToken } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

export default function ProfileScreen({ navigation }) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.get("/api/user/me");
      setUser(res.data);
      setNameDraft(res.data.userName);
      setEmailDraft(res.data.email);
    } catch (err) {
      Alert.alert("Error", "Failed to load profile");
    }
  };

  useEffect(() => {
    const sub = navigation.addListener("focus", loadData);
    return sub;
  }, [navigation]);

  const logout = async () => {
    setAuthToken(null);
    await AsyncStorage.removeItem("token");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const saveProfile = async () => {
    if (!nameDraft.trim() || !emailDraft.trim()) {
      Alert.alert("Error", "Name and Email cannot be empty");
      return;
    }

    try {
      setSaving(true);
      await api.put("/api/user/update", {
        userName: nameDraft,
        email: emailDraft,
      });
      setUser({ ...user, userName: nameDraft, email: emailDraft });
      setEditMode(false);
      Alert.alert("Success", "Profile updated");
    } catch {
      Alert.alert("Error", "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.background }]}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: Colors.textDark }]}>Profile</Text>

      {/* Profile card */}
      <View
        style={[
          styles.card,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <View style={styles.userRow}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: darkMode ? "#1e1e1e" : "#e2edff" },
            ]}
          >
            <Feather name="user" size={26} color={Colors.primary} />
          </View>

          {!editMode ? (
            <View style={{ flex: 1 }}>
              <Text style={[styles.userText, { color: Colors.textDark }]}>
                {user?.userName}
              </Text>
              <Text style={[styles.emailText, { color: Colors.textLight }]}>
                {user?.email}
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: Colors.border, color: Colors.textDark },
                ]}
                placeholder="Name"
                placeholderTextColor={Colors.textLight}
                value={nameDraft}
                onChangeText={setNameDraft}
              />
              <TextInput
                style={[
                  styles.input,
                  { borderColor: Colors.border, color: Colors.textDark },
                ]}
                placeholder="Email"
                placeholderTextColor={Colors.textLight}
                value={emailDraft}
                onChangeText={setEmailDraft}
                autoCapitalize="none"
              />
            </View>
          )}

          {!editMode && (
            <TouchableOpacity onPress={() => setEditMode(true)}>
              <Feather name="edit-2" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {editMode && (
          <View style={styles.editButtonsRow}>
            <TouchableOpacity
              style={[styles.smallButton, { backgroundColor: Colors.primary }]}
              onPress={saveProfile}
            >
              <Text style={styles.smallButtonText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.smallButton,
                { backgroundColor: darkMode ? "#333" : "#e0e0e0" },
              ]}
              onPress={() => {
                setEditMode(false);
                setNameDraft(user.userName);
                setEmailDraft(user.email);
              }}
            >
              <Text
                style={[
                  styles.smallButtonText,
                  { color: darkMode ? Colors.textDark : "#111" },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Settings */}
      <Text style={[styles.sectionLabel, { color: Colors.textLight }]}>
        SETTINGS
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <View style={styles.rowButton}>
          <Text style={[styles.rowText, { color: Colors.textDark }]}>
            Dark Mode
          </Text>
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            thumbColor={darkMode ? Colors.primary : "#f4f4f4"}
          />
        </View>
      </View>

      {/* App info */}
      <Text style={[styles.sectionLabel, { color: Colors.textLight }]}>
        APP
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.rowButton}
          onPress={() =>
            Alert.alert(
              "Terms & Conditions",
              "Demo SkillTrack app for portfolio purposes. In a real app this would link to full legal terms."
            )
          }
        >
          <Text style={[styles.rowText, { color: Colors.textDark }]}>
            Terms & Conditions
          </Text>
          <Feather name="chevron-right" size={20} color={Colors.textMedium} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: Colors.border }]} />

        <TouchableOpacity
          style={styles.rowButton}
          onPress={() =>
            Alert.alert(
              "Privacy Policy",
              "Your data is used only inside this demo app and not shared."
            )
          }
        >
          <Text style={[styles.rowText, { color: Colors.textDark }]}>
            Privacy Policy
          </Text>
          <Feather name="chevron-right" size={20} color={Colors.textMedium} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: Colors.border }]} />

        <View style={styles.rowButton}>
          <Text style={[styles.rowText, { color: Colors.textDark }]}>
            App Version
          </Text>
          <Text style={[styles.rowText, { color: Colors.textMedium }]}>
            1.0.0
          </Text>
        </View>
      </View>

      {/* Logout fully visible now */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: Colors.danger }]}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 70 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 20 },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  userRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  userText: { fontSize: 18, fontWeight: "700" },
  emailText: { fontSize: 13 },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 8,
  },

  editButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  smallButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  smallButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 10,
  },

  rowButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    alignItems: "center",
  },
  rowText: { fontSize: 16 },

  divider: { height: 1, width: "100%", opacity: 0.4 },

  logoutButton: {
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
