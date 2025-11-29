// src/theme/colors.js

// Light (Apple-like)
export const LightColors = {
  background: "#f4f4f7",
  card: "#ffffff",
  textDark: "#111111",
  textMedium: "#4a4a4a",
  textLight: "#9ea4b0",
  border: "#d5d8e0",
  shadow: "rgba(0,0,0,0.06)",
};

// Dark (Premium / near-OLED)
export const DarkColors = {
  background: "#000000",
  card: "#111319",
  textDark: "#f5f5f5",
  textMedium: "#b0bec5",
  textLight: "#7b8794",
  border: "#262b34",
  shadow: "rgba(0,0,0,0.5)",
};

// Shared brand colors
export const BaseColors = {
  primary: "#4A90E2",
  success: "#43a047",
  danger: "#E74C3C",
  level: {
    beginner: "#81c784",
    intermediate: "#64b5f6",
    advanced: "#ba68c8",
  },
};

export const getColors = (darkMode) => {
  const theme = darkMode ? DarkColors : LightColors;
  return { ...theme, ...BaseColors };
};
