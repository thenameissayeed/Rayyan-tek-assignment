import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
} from "react-native";

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 1. ADD YOUR LIVE RENDER URL HERE
  const API_URL = "https://rayyan-tek-assignment.onrender.com/api/public";

  const { userRole, language } = route.params || { userRole: "Admin", language: "ENG" };

  const t = (en, ur) => (language === "ENG" ? en : ur);
  const isUrdu = language === "URD";

  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      alert(t("Please fill all fields correctly", "براہ کرم تمام خانے صحیح طریقے سے پُر کریں"));
      return;
    }

    // Note: In a real production app, you would fetch from API_URL here.
    // For now, we are using your hardcoded credentials logic:
    if (userRole === "Admin") {
      if (cleanEmail === "admin@college.com" && cleanPass === "admin123") {
        navigation.navigate("AdminDashboard");
      } else {
        alert(t("Invalid Admin Credentials", "ایڈمن کی معلومات درست نہیں ہیں"));
      }
    } 
    else if (userRole === "Teacher") {
      if (cleanEmail === "teacher@college.com" && cleanPass === "teacher123") {
        navigation.navigate("AttendanceScreen"); // Ensure this matches your navigation name
      } else {
        alert(t("Invalid Teacher Credentials", "ٹیچر کی معلومات درست نہیں ہیں"));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <Image source={require("../../../assets/Nadwa_bg.jpg")} style={styles.bgImage} />
        <View style={styles.overlay} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={true}
        alwaysBounceVertical={true}
      >
        <View style={styles.loginCard}>
          <Image source={require("../../../assets/Nadwa_logo.svg")} style={styles.logo} />
          
          <Text style={styles.title}>
            {t("Login as", "لاگ ان بطور")} {t(userRole, userRole === "Admin" ? "ایڈمن" : "ٹیچر")}
          </Text>
          <Text style={styles.subtitle}>
            {t(`Enter ${userRole} Credentials`, `${t(userRole, userRole === "Admin" ? "ایڈمن" : "ٹیچر")} کی معلومات درج کریں`)}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isUrdu && { textAlign: 'right' }]}>
                {t("Email Address", "ای میل ایڈریس")}
            </Text>
            <TextInput
              style={[styles.input, isUrdu && { textAlign: 'right' }]}
              placeholder={userRole === "Admin" ? t("Enter Admin Email", "ایڈمن ای میل درج کریں") : t("Enter Staff Email", "اسٹاف ای میل درج کریں")}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, isUrdu && { textAlign: 'right' }]}>
                {t("Password", "پاس ورڈ")}
            </Text>
            <TextInput
              style={[styles.input, isUrdu && { textAlign: 'right' }]}
              placeholder={t("Enter Password", "پاس ورڈ درج کریں")}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>{t("SIGN IN", "سائن ان")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{t("← Back to Portals", "پورٹلز پر واپس جائیں ←")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
    position: Platform.OS === 'web' ? 'fixed' : 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  bgImage: { width: "100%", height: "100%", position: 'absolute' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,35,0,0.8)" },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginCard: {
    width: Platform.OS === 'web' ? 400 : '100%',
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
  },
  logo: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#006400" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 30, marginTop: 5 },
  inputGroup: { width: "100%", marginBottom: 20 },
  label: { fontSize: 12, fontWeight: "bold", color: "#006400", marginBottom: 8 },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loginBtn: {
    backgroundColor: "#006400",
    width: "100%",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginBtnText: { color: "#fff", fontWeight: "bold", letterSpacing: 1 },
  backText: { marginTop: 20, color: "#D4AF37", fontWeight: "600" },
});

export default LoginScreen;
