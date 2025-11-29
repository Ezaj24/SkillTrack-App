// src/screens/UpdateSkillScreen.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";
import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

export default function UpdateSkillScreen({ navigation, route }) {
  const { skill } = route.params;
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [name, setName] = useState(skill.name);
  const [category, setCategory] = useState(skill.category);
  const [level, setLevel] = useState(skill.level);

  const handleUpdate = async () => {
    if (!name.trim() || !category.trim()) {
      Alert.alert("Error", "Name and Category are required.");
      return;
    }

    try {
      await api.put(`/api/skills/${skill.id}`, {
        name,
        category,
        level,
      });
      Alert.alert("Success", "Skill updated.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to update skill.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.textDark }]}>
          Edit Skill
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: Colors.card, borderColor: Colors.border, color: Colors.textDark },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Skill Name"
        placeholderTextColor={Colors.textLight}
      />

      <TextInput
        style={[
          styles.input,
          { backgroundColor: Colors.card, borderColor: Colors.border, color: Colors.textDark },
        ]}
        value={category}
        onChangeText={setCategory}
        placeholder="Category"
        placeholderTextColor={Colors.textLight}
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
              style={{
                color: level === lvl ? "white" : Colors.textDark,
                fontWeight: "600",
              }}
            >
              {lvl === 1 ? "Beginner" : lvl === 2 ? "Intermediate" : "Advanced"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: Colors.primary }]}
        onPress={handleUpdate}
      >
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
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
  headerTitle: { fontSize: 20, fontWeight: "700" },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
  },
  label: { fontSize: 14, marginBottom: 6 },

  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  levelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 8,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  saveText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
