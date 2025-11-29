// src/screens/SkillsScreen.js

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";
import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

const toTitleCase = (str) =>
  str
    .split(" ")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");

export default function SkillsScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const res = await api.get("/api/skills");
      setSkills(res.data || []);
    } catch (err) {
      console.log("FETCH SKILLS ERROR:", err.response?.data || err.message);
    }
    setLoading(false);
  };

  const deleteSkill = (id) => {
    Alert.alert("Delete Skill", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/skills/${id}`);
            fetchSkills();
          } catch {
            Alert.alert("Error", "Could not delete skill");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", fetchSkills);
    return unsub;
  }, [navigation]);

  const grouped = skills.reduce((acc, skill) => {
    const raw = (skill.category || "Uncategorized").trim().toLowerCase();
    const key = raw || "uncategorized";
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  const getLevelColor = (level) => {
    if (level === 1) return Colors.level.beginner;
    if (level === 2) return Colors.level.intermediate;
    return Colors.level.advanced;
  };

  const getLevelText = (level) => {
    if (level === 1) return "Beginner";
    if (level === 2) return "Intermediate";
    return "Advanced";
  };

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: Colors.textDark }]}>Skills</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddSkill")}>
          <Feather name="plus-circle" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {skills.length === 0 && (
        <Text style={[styles.empty, { color: Colors.textMedium }]}>
          No skills added yet. Start by adding one.
        </Text>
      )}

      {categories.map((key) => {
        const label = key === "uncategorized" ? "Uncategorized" : toTitleCase(key);
        return (
          <View key={key} style={styles.categoryBlock}>
            <Text style={[styles.categoryTitle, { color: Colors.textMedium }]}>
              {label}
            </Text>

            {grouped[key].map((skill) => (
              <View
                key={skill.id}
                style={[
                  styles.card,
                  { backgroundColor: Colors.card, borderColor: Colors.border },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.skillName, { color: Colors.textDark }]}
                  >
                    {skill.name}
                  </Text>

                  <View style={styles.tagRow}>
                    <View
                      style={[
                        styles.levelTag,
                        { backgroundColor: getLevelColor(skill.level) },
                      ]}
                    >
                      <Text style={styles.levelText}>
                        {getLevelText(skill.level)}
                      </Text>
                    </View>
                    <Text
                      style={[styles.timestamp, { color: Colors.textLight }]}
                    >
                      Updated {new Date(skill.lastUpdated).toDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionsCol}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("UpdateSkill", { skill })
                    }
                  >
                    <Feather name="edit" size={22} color={Colors.primary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => deleteSkill(skill.id)}
                    style={{ marginTop: 12 }}
                  >
                    <Feather name="trash-2" size={22} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 70 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: { fontSize: 28, fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 30, fontSize: 15 },

  categoryBlock: { marginBottom: 18 },
  categoryTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
  },
  skillName: { fontSize: 18, fontWeight: "700" },

  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  levelTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 12,
  },
  levelText: { fontSize: 12, color: "white", fontWeight: "600" },

  timestamp: { fontSize: 12 },

  actionsCol: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
