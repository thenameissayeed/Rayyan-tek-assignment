import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import LandingScreen from "./src/screens/Public/LandingScreen";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import AdminDashboard from "./src/screens/Admin/AdminDashboard";
import AttendanceScreen from "./src/screens/Teacher/AttendanceScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="TeacherDashboard" component={AttendanceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
});