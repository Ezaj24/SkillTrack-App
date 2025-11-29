// src/screens/AddGoalScreen.js

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";
import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

export default function AddGoalScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (event, selected) => {
    setShowPicker(false);
    if (selected) setTargetDate(selected);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and Description are required.");
      return;
    }

    try {
      await api.post("/api/goals", {
        title,
        description,
        targetDate: targetDate.toISOString(),
      });
      Alert.alert("Success", "Goal added.");
      navigation.goBack();
    } catch (err) {
      console.log("ADD GOAL ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to add goal.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.textDark }]}>
          Add Goal
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: Colors.card, borderColor: Colors.border, color: Colors.textDark },
        ]}
        placeholder="Goal Title"
        placeholderTextColor={Colors.textLight}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[
          styles.textArea,
          { backgroundColor: Colors.card, borderColor: Colors.border, color: Colors.textDark },
        ]}
        placeholder="Description"
        placeholderTextColor={Colors.textLight}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={[
          styles.dateButton,
          { backgroundColor: Colors.card, borderColor: Colors.border },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Feather name="calendar" size={20} color={Colors.primary} />
        <Text style={[styles.dateText, { color: Colors.textDark }]}>
          {targetDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={targetDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: Colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveText}>Save Goal</Text>
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
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    height: 110,
    textAlignVertical: "top",
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 8,
    fontSize: 15,
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
