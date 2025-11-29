// src/screens/GoalsScreen.js

import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { api } from "../api/api";
import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GoalsScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fade = useRef(new Animated.Value(0)).current;

  const fetchGoals = async () => {
    try {
      const res = await api.get("/api/goals");
      setGoals(res.data || []);
    } catch (err) {
      console.log("GOALS FETCH ERROR:", err.message);
    }

    setLoading(false);
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const sub = navigation.addListener("focus", fetchGoals);
    return sub;
  }, [navigation]);

  const deleteGoal = (id) => {
    Alert.alert("Delete Goal", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/api/goals/${id}`);
            fetchGoals();
          } catch {
            Alert.alert("Error", "Could not delete goal");
          }
        },
      },
    ]);
  };

  const groupedByYear = goals.reduce((acc, goal) => {
    const d = new Date(goal.targetDate);
    const y = d.getFullYear();
    const m = d.getMonth();

    if (!acc[y]) acc[y] = {};
    if (!acc[y][m]) acc[y][m] = [];

    acc[y][m].push(goal);
    return acc;
  }, {});

  const years = Object.keys(groupedByYear)
    .map((y) => parseInt(y, 10))
    .sort((a, b) => a - b);

  const renderGoalCard = (goal) => (
    <View
      key={goal.id}
      style={[
        styles.card,
        { backgroundColor: Colors.card, borderColor: Colors.border },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.goalTitle, { color: Colors.textDark }]}>
          {goal.title}
        </Text>

        <Text style={[styles.goalDesc, { color: Colors.textMedium }]}>
          {goal.description}
        </Text>

        <Text style={[styles.goalDate, { color: Colors.textLight }]}>
          Target: {new Date(goal.targetDate).toDateString()}
        </Text>
      </View>

      <View style={styles.actionsCol}>
        <TouchableOpacity
          onPress={() => navigation.navigate("UpdateGoal", { goal })}
        >
          <Feather name="edit" size={22} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteGoal(goal.id)}
          style={{ marginTop: 14 }}
        >
          <Feather name="trash-2" size={22} color={Colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: Colors.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fade }}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: Colors.textDark }]}>
              Goals
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddGoal")}>
              <Feather name="plus-circle" size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {goals.length === 0 && (
            <Text style={[styles.empty, { color: Colors.textMedium }]}>
              No goals yet.
            </Text>
          )}

          {/* YEAR GROUPS */}
          {years.map((year) => (
            <View key={year} style={styles.yearBlock}>
              <Text
                style={[styles.yearTitle, { color: Colors.textMedium }]}
              >
                {year}
              </Text>

              {/* MONTH GROUPS */}
              {Object.keys(groupedByYear[year])
                .map((m) => parseInt(m, 10))
                .sort((a, b) => a - b)
                .map((month) => (
                  <View key={month} style={styles.monthBlock}>
                    <Text
                      style={[styles.monthTitle, { color: Colors.textLight }]}
                    >
                      {MONTHS[month]}
                    </Text>

                    {groupedByYear[year][month].map(renderGoalCard)}
                  </View>
                ))}
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

/* ---------------------------- STYLES ---------------------------- */

const styles = StyleSheet.create({
  scroll: { flex: 1, padding: 22, paddingTop: 70 },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  title: { fontSize: 30, fontWeight: "700" },

  empty: { textAlign: "center", marginTop: 30, fontSize: 15 },

  yearBlock: { marginBottom: 28 },
  yearTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },

  monthBlock: { marginBottom: 16 },
  monthTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
  },

  goalTitle: { fontSize: 17, fontWeight: "700" },
  goalDesc: { fontSize: 14, marginTop: 4 },
  goalDate: { fontSize: 12, marginTop: 6 },

  actionsCol: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 14,
  },
});
