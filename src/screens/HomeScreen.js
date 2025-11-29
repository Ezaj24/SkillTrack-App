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
import { getQuoteOfTheDay } from "../utils/QuoteManager";

export default function HomeScreen({ navigation }) {
  const { darkMode } = useContext(ThemeContext);
  const Colors = getColors(darkMode);

  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const quote = getQuoteOfTheDay();

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
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 550,
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
      <View style={[styles.loading, { backgroundColor: Colors.background }]}>
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
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Animated.View style={{ opacity: fadeIn }}>
        {/* Greeting */}
        <Text style={[styles.greeting, { color: Colors.textDark }]}>
          Hi {firstName} 👋
        </Text>
        <Text style={[styles.subTitle, { color: Colors.textMedium }]}>
          Track. Improve. Achieve.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="layers"
            label="Skills"
            value={totalSkills}
            color={Colors.primary}
            Colors={Colors}
            navigation={navigation}
            screen="Skills"
          />

          <StatCard
            icon="target"
            label="Goals"
            value={totalGoals}
            color={Colors.success}
            Colors={Colors}
            navigation={navigation}
            screen="Goals"
          />

          <StatCard
            icon="alert-circle"
            label="Due Soon"
            value={goalsDueSoon}
            color={Colors.danger}
            Colors={Colors}
            navigation={navigation}
            screen="Goals"
          />
        </View>

        {/* Quick actions */}
        <Text style={[styles.sectionHeader, { color: Colors.textDark }]}>
          Quick Actions
        </Text>

        <View style={styles.quickRow}>
          <QuickButton
            icon="plus"
            text="Add Skill"
            bg={Colors.primary}
            onPress={() => navigation.navigate("AddSkill")}
          />

          <QuickButton
            icon="target"
            text="Add Goal"
            bg={Colors.success}
            onPress={() => navigation.navigate("AddGoal")}
          />
        </View>

        {/* Quote */}
        <View
          style={[
            styles.quoteCard,
            { backgroundColor: Colors.card, borderColor: Colors.border },
          ]}
        >
          <Feather name="zap" size={20} color={Colors.primary} />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.quoteText, { color: Colors.textDark }]}>
              “{quote.text}”
            </Text>
            <Text style={[styles.quoteAuthor, { color: Colors.textLight }]}>
              — {quote.author}
            </Text>
          </View>
        </View>

        {/* Upcoming goals */}
        {upcomingGoals.length > 0 && (
          <>
            <Text style={[styles.sectionHeader, { color: Colors.textDark }]}>
              Upcoming Goals
            </Text>

            {upcomingGoals.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[
                  styles.goalCard,
                  { backgroundColor: Colors.card, borderColor: Colors.border },
                ]}
                onPress={() => navigation.navigate("UpdateGoal", { goal: g })}
              >
                <View>
                  <Text style={[styles.goalTitle, { color: Colors.textDark }]}>
                    {g.title}
                  </Text>
                  <Text
                    style={[styles.goalDate, { color: Colors.textMedium }]}
                  >
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

/* COMPONENTS */
const StatCard = ({ icon, label, value, color, Colors, navigation, screen }) => (
  <TouchableOpacity
    style={[
      styles.statCard,
      { backgroundColor: Colors.card, borderColor: Colors.border },
    ]}
    onPress={() => navigation.navigate(screen)}
  >
    <Feather name={icon} size={22} color={color} />
    <Text style={[styles.statValue, { color: Colors.textDark }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: Colors.textLight }]}>{label}</Text>
  </TouchableOpacity>
);

const QuickButton = ({ icon, text, bg, onPress }) => (
  <TouchableOpacity style={[styles.quickBtn, { backgroundColor: bg }]} onPress={onPress}>
    <Feather name={icon} size={18} color="white" />
    <Text style={styles.quickBtnText}>{text}</Text>
  </TouchableOpacity>
);

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 70 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  greeting: { fontSize: 28, fontWeight: "700" },
  subTitle: { fontSize: 15, marginTop: 4, marginBottom: 20 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    width: "31%",
    padding: 14,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 18, fontWeight: "700", marginTop: 6 },
  statLabel: { fontSize: 12, marginTop: 2 },

  sectionHeader: { fontSize: 20, fontWeight: "700", marginTop: 26, marginBottom: 12 },

  quickRow: { flexDirection: "row", justifyContent: "space-between" },
  quickBtn: {
    width: "48%",
    paddingVertical: 13,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  quickBtnText: {
    color: "white",
    fontSize: 15,
    marginLeft: 6,
    fontWeight: "600",
  },

  quoteCard: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginTop: 26,
    alignItems: "center",
  },
  quoteText: { fontSize: 14, fontWeight: "600" },
  quoteAuthor: { fontSize: 12, marginTop: 4 },

  goalCard: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTitle: { fontSize: 15, fontWeight: "600" },
  goalDate: { fontSize: 12, marginTop: 2 },
});
