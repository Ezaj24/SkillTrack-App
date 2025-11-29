// src/screens/HomeScreen.js

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { api } from "../api/api";

import { ThemeContext } from "../theme/ThemeContext";
import { getColors } from "../theme/colors";

import { getQuoteOfTheDay } from "../utils/QuoteManager";   // ⭐ ADDED

export default function HomeScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fade = useRef(new Animated.Value(0)).current;

  const quote = getQuoteOfTheDay();  // ⭐ ADDED

  const loadData = async () => {
    try {
      const [u, s, g] = await Promise.all([
        api.get("/api/user/me"),
        api.get("/api/skills"),
        api.get("/api/goals"),
      ]);
      setUser(u.data);
      setSkills(s.data);
      setGoals(g.data);
    } catch (err) {
      console.log("HOME LOAD ERROR:", err.message);
    } finally {
      setLoading(false);
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", loadData);
    return unsub;
  }, [navigation]);

  if (loading) {
    return (
      <View
        style={[styles.loading, { backgroundColor: Colors.background }]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const firstName = user?.userName?.split(" ")[0] || "User";

  const totalSkills = skills.length;
  const totalGoals = goals.length;
  const goalsDueSoon = goals.filter((g) => {
    const diff = new Date(g.targetDate) - new Date();
    return diff > 0 && diff < 7 * 86400000;
  }).length;

  const upcomingGoals = goals
    .filter((g) => new Date(g.targetDate) > new Date())
    .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
    .slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: Colors.background }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ opacity: fade }}>
        
        {/* GREETING */}
        <Text style={[styles.greeting, { color: Colors.textDark }]}>
          Hi {firstName} 👋
        </Text>

        <Text style={[styles.dashboardTitle, { color: Colors.textMedium }]}>
          Dashboard
        </Text>

        {/* STATS */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: Colors.card, borderColor: Colors.border },
            ]}
            onPress={() => navigation.navigate("Skills")}
          >
            <Feather name="layers" size={22} color={Colors.primary} />
            <Text style={[styles.statNumber, { color: Colors.textDark }]}>
              {totalSkills}
            </Text>
            <Text style={[styles.statLabel, { color: Colors.textLight }]}>
              Skills
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: Colors.card, borderColor: Colors.border },
            ]}
            onPress={() => navigation.navigate("Goals")}
          >
            <Feather name="target" size={22} color={Colors.success} />
            <Text style={[styles.statNumber, { color: Colors.textDark }]}>
              {totalGoals}
            </Text>
            <Text style={[styles.statLabel, { color: Colors.textLight }]}>
              Goals
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: Colors.card, borderColor: Colors.border },
            ]}
            onPress={() => navigation.navigate("Goals")}
          >
            <Feather name="alert-circle" size={22} color={Colors.danger} />
            <Text style={[styles.statNumber, { color: Colors.textDark }]}>
              {goalsDueSoon}
            </Text>
            <Text style={[styles.statLabel, { color: Colors.textLight }]}>
              Due Soon
            </Text>
          </TouchableOpacity>
        </View>

        {/* QUICK ACTIONS */}
        <Text style={[styles.sectionTitle, { color: Colors.textDark }]}>
          Quick Actions
        </Text>

        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[
              styles.quickButton,
              { backgroundColor: Colors.primary },
            ]}
            onPress={() => navigation.navigate("AddSkill")}
          >
            <Feather name="plus" size={20} color="white" />
            <Text style={styles.quickText}>Add Skill</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.quickButton,
              { backgroundColor: Colors.success },
            ]}
            onPress={() => navigation.navigate("AddGoal")}
          >
            <Feather name="target" size={20} color="white" />
            <Text style={styles.quickText}>Add Goal</Text>
          </TouchableOpacity>
        </View>

        {/* ⭐ QUOTE OF THE DAY ⭐ */}
        <View
          style={[
            styles.quoteCard,
            { backgroundColor: Colors.card, borderColor: Colors.border },
          ]}
        >
          <Feather
            name="zap"
            size={20}
            color={Colors.primary}
            style={{ marginRight: 8 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.quoteText, { color: Colors.textDark }]}>
              “{quote.text}”
            </Text>
            <Text style={[styles.quoteAuthor, { color: Colors.textLight }]}>
              — {quote.author}
            </Text>
          </View>
        </View>

        {/* UPCOMING GOALS */}
        {upcomingGoals.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: Colors.textDark }]}>
              Upcoming Goals
            </Text>

            {upcomingGoals.map((g) => (
              <TouchableOpacity
                key={g.id}
                onPress={() =>
                  navigation.navigate("UpdateGoal", { goal: g })  // ⭐ NOW CLICKABLE
                }
                style={[
                  styles.goalItem,
                  { backgroundColor: Colors.card, borderColor: Colors.border },
                ]}
              >
                <View>
                  <Text style={[styles.goalTitle, { color: Colors.textDark }]}>
                    {g.title}
                  </Text>
                  <Text style={[styles.goalDate, { color: Colors.textLight }]}>
                    {new Date(g.targetDate).toDateString()}
                  </Text>
                </View>

                <Feather
                  name="chevron-right"
                  size={20}
                  color={Colors.textMedium}
                />
              </TouchableOpacity>
            ))}
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 70 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  greeting: { fontSize: 28, fontWeight: "700" },
  dashboardTitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
    fontWeight: "500",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    width: "31%",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  statNumber: { fontSize: 18, fontWeight: "700", marginTop: 6 },
  statLabel: { fontSize: 12 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 10,
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickButton: {
    width: "48%",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  quickText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },

  quoteCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginTop: 26,
  },
  quoteText: { fontSize: 14, fontWeight: "600" },
  quoteAuthor: { fontSize: 12, marginTop: 4 },

  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 8,
  },
  goalTitle: { fontSize: 15, fontWeight: "600" },
  goalDate: { fontSize: 12, marginTop: 2 },
});
