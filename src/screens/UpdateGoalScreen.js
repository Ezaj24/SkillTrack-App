// src/screens/UpdateGoalScreen.js

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

export default function UpdateGoalScreen({ navigation, route }) {
  const { goal } = route.params;
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [targetDate, setTargetDate] = useState(new Date(goal.targetDate));
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = (event, selected) => {
    setShowPicker(false);
    if (selected) setTargetDate(selected);
  };

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and Description are required.");
      return;
    }

    try {
      await api.put(`/api/goals/${goal.id}`, {
        title,
        description,
        targetDate: targetDate.toISOString(),
      });
      Alert.alert("Success", "Goal updated.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to update goal.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: Colors.textDark }]}>
          Edit Goal
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: Colors.card, borderColor: Colors.border, color: Colors.textDark },
        ]}
        value={title}
        onChangeText={setTitle}
        placeholder="Goal Title"
        placeholderTextColor={Colors.textLight}
      />

      <TextInput
        style={[
          styles.textArea,
          { backgroundColor: Colors.card, borderColor: Colors.border, color: Colors.textDark },
        ]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        placeholderTextColor={Colors.textLight}
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
