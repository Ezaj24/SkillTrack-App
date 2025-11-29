// src/theme/ThemeContext.js

import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem("theme");
        if (saved === "dark") setDarkMode(true);
        if (saved === "light") setDarkMode(false);
      } catch {
        // ignore
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const next = !darkMode;
    setDarkMode(next);
    try {
      await AsyncStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
