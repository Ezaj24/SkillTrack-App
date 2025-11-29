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
    } catch {
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
      {/* Title */}
      <Text style={[styles.title, { color: Colors.textDark }]}>
        Profile
      </Text>

      {/* PROFILE HEADER CARD */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          {/* Avatar */}
          <View
            style={[
              styles.avatar,
              { backgroundColor: darkMode ? "#1e1e1e" : "#e7efff" },
            ]}
          >
            <Feather name="user" size={30} color={Colors.primary} />
          </View>

          {/* View or Edit Mode */}
          {!editMode ? (
            <View style={{ flex: 1 }}>
              <Text style={[styles.nameText, { color: Colors.textDark }]}>
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
                  {
                    borderColor: Colors.border,
                    backgroundColor: Colors.card,
                    color: Colors.textDark,
                  },
                ]}
                placeholder="Name"
                placeholderTextColor={Colors.textLight}
                value={nameDraft}
                onChangeText={setNameDraft}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: Colors.border,
                    backgroundColor: Colors.card,
                    color: Colors.textDark,
                  },
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

        {/* Save / Cancel */}
        {editMode && (
          <View style={styles.editRow}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: Colors.primary },
              ]}
              onPress={saveProfile}
            >
              <Text style={styles.saveText}>
                {saving ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                { backgroundColor: Colors.card, borderColor: Colors.border },
              ]}
              onPress={() => {
                setEditMode(false);
                setNameDraft(user.userName);
                setEmailDraft(user.email);
              }}
            >
              <Text
                style={[
                  styles.cancelText,
                  { color: Colors.textDark },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SETTINGS SECTION */}
      <Text style={[styles.sectionLabel, { color: Colors.textLight }]}>
        SETTINGS
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <View style={styles.row}>
          <Text style={[styles.rowText, { color: Colors.textDark }]}>
            Dark Mode
          </Text>
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            thumbColor={darkMode ? Colors.primary : "#ffffff"}
          />
        </View>
      </View>

      {/* APP INFO SECTION */}
      <Text style={[styles.sectionLabel, { color: Colors.textLight }]}>
        APP INFORMATION
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.row}
          onPress={() => Alert.alert("Terms & Conditions", "Demo version.")}
        >
          <Text style={[styles.rowText, { color: Colors.textDark }]}>
            Terms & Conditions
          </Text>
          <Feather name="chevron-right" size={20} color={Colors.textMedium} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: Colors.border }]} />

        <TouchableOpacity
          style={styles.row}
          onPress={() => Alert.alert("Privacy Policy", "Data stays local.")}
        >
          <Text style={[styles.rowText, { color: Colors.textDark }]}>
            Privacy Policy
          </Text>
          <Feather name="chevron-right" size={20} color={Colors.textMedium} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: Colors.border }]} />

        <View style={styles.row}>
          <Text style={[styles.rowText, { color: Colors.textDark }]}>
            App Version
          </Text>
          <Text style={[styles.rowText, { color: Colors.textMedium }]}>
            1.0.0
          </Text>
        </View>
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: Colors.danger }]}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 70 },

  title: { fontSize: 32, fontWeight: "700", marginBottom: 20 },

  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  nameText: { fontSize: 20, fontWeight: "700" },
  emailText: { fontSize: 13, marginTop: 4 },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },

  editRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
  },

  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveText: { color: "white", fontSize: 15, fontWeight: "600" },

  cancelButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginLeft: 10,
  },
  cancelText: { fontSize: 15, fontWeight: "600" },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 12,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
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
