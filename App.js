// App.js

import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider, ThemeContext } from "./src/theme/ThemeContext";

function Root() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <>
      <StatusBar
        style={darkMode ? "light" : "dark"}
        backgroundColor={darkMode ? "#000000" : "#f4f4f7"}
        translucent={false}
      />

      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}
