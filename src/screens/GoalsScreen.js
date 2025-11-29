// src/screens/GoalsScreen.js

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { api } from "../api/api";
import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function GoalsScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const res = await api.get("/api/goals");
      setGoals(res.data || []);
    } catch (err) {
      console.log("GOALS FETCH ERROR:", err.message);
    }
    setLoading(false);
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
            Alert.alert("Error", "Error deleting goal");
          }
        },
      },
    ]);
  };

  const groupedByYear = goals.reduce((acc, goal) => {
    const d = new Date(goal.targetDate);
    const year = d.getFullYear();
    const month = d.getMonth();

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(goal);
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
      <Text style={[styles.goalTitle, { color: Colors.textDark }]}>
        {goal.title}
      </Text>
      <Text style={[styles.goalDesc, { color: Colors.textMedium }]}>
        {goal.description}
      </Text>
      <Text style={[styles.goalDate, { color: Colors.textLight }]}>
        Target: {new Date(goal.targetDate).toDateString()}
      </Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate("UpdateGoal", { goal })}
        >
          <Feather name="edit" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteGoal(goal.id)}>
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
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
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
            No goals yet. Create your first one.
          </Text>
        )}

        {years.map((year) => (
          <View key={year} style={styles.yearBlock}>
            <Text style={[styles.yearTitle, { color: Colors.textMedium }]}>
              {year}
            </Text>
            {Object.keys(groupedByYear[year])
              .map((m) => parseInt(m, 10))
              .sort((a, b) => a - b)
              .map((month) => (
                <View key={month} style={styles.monthBlock}>
                  <Text
                    style={[styles.monthTitle, { color: Colors.textLight }]}
                  >
                    {monthNames[month]}
                  </Text>
                  {groupedByYear[year][month].map(renderGoalCard)}
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, padding: 22, paddingTop: 70 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 30 },

  yearBlock: { marginBottom: 20 },
  yearTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  monthBlock: { marginBottom: 10 },
  monthTitle: { fontSize: 13, fontWeight: "600", marginBottom: 6 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
  },
  goalTitle: { fontSize: 18, fontWeight: "700" },
  goalDesc: { fontSize: 14, marginTop: 4 },
  goalDate: { fontSize: 12, marginTop: 6 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 4,
  },
});
