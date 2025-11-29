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
  KeyboardAvoidingView,
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

  const onDateChange = (_, selected) => {
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
      console.log("UPDATE GOAL ERROR:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to update goal.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.textDark }]}>
            Edit Goal
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
            Title
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
            value={title}
            onChangeText={setTitle}
            placeholder="Goal Title"
            placeholderTextColor={Colors.textLight}
          />

          <Text style={[styles.label, { color: Colors.textMedium }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: Colors.card,
                borderColor: Colors.border,
                color: Colors.textDark,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor={Colors.textLight}
            multiline
          />

          <Text style={[styles.label, { color: Colors.textMedium }]}>
            Target Date
          </Text>

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
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: Colors.primary }]}
          onPress={handleUpdate}
        >
          <Text style={styles.saveText}>Save Changes</Text>
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
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 110,
    fontSize: 15,
    marginBottom: 16,
    textAlignVertical: "top",
  },

  dateButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: { marginLeft: 8, fontSize: 15 },

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
