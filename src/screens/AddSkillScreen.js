// src/screens/AddSkillScreen.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";
import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

export default function AddSkillScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState(1);

  const handleSave = async () => {
    if (!name.trim() || !category.trim()) {
      Alert.alert("Error", "Name and Category are required.");
      return;
    }

    try {
      await api.post("/api/skills", { name, category, level });
      Alert.alert("Success", "Skill added.");
      navigation.goBack();
    } catch (err) {
      console.log("ADD SKILL ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to add skill.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Header */}
        <View className="headerRow" style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={Colors.textDark} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: Colors.textDark }]}>
            Add Skill
          </Text>

          <View style={{ width: 24 }} />
        </View>

        {/* Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: Colors.card, borderColor: Colors.border },
          ]}
        >
          <Text style={[styles.label, { color: Colors.textMedium }]}>
            Skill Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: Colors.card,
                borderColor: Colors.border,
                color: Colors.textDark,
              },
            ]}
            placeholder="e.g. C#, Python"
            placeholderTextColor={Colors.textLight}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: Colors.textMedium }]}>
            Category
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: Colors.card,
                borderColor: Colors.border,
                color: Colors.textDark,
              },
            ]}
            placeholder="Backend, Frontend, Tools..."
            placeholderTextColor={Colors.textLight}
            value={category}
            onChangeText={setCategory}
          />

          <Text style={[styles.label, { color: Colors.textMedium }]}>
            Level
          </Text>

          <View style={styles.levelRow}>
            {[1, 2, 3].map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.levelButton,
                  {
                    backgroundColor:
                      level === lvl ? Colors.primary : Colors.card,
                    borderColor:
                      level === lvl ? Colors.primary : Colors.border,
                  },
                ]}
                onPress={() => setLevel(lvl)}
              >
                <Text
                  style={[
                    styles.levelText,
                    { color: level === lvl ? "white" : Colors.textDark },
                  ]}
                >
                  {lvl === 1
                    ? "Beginner"
                    : lvl === 2
                    ? "Intermediate"
                    : "Advanced"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: Colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Save Skill</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 60 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 22, fontWeight: "700" },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },

  label: { fontSize: 14, marginBottom: 6, fontWeight: "600" },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  levelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
  },
  levelText: { fontSize: 14, fontWeight: "600" },

  saveButton: {
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 10,
  },
  saveText: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});
