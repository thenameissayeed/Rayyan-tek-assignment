import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const AttendanceScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [language, setLanguage] = useState('ENG');

  const API_URL = "https://rayyan-tek-assignment.onrender.com/api/public";

  const loadData = async () => {
    try {
      const response = await fetch(`${API_URL}/all-data`);
      const data = await response.json();
      
      setDepartments(data.departments || []);
      setClasses(data.classes || []);
      setStudents(data.students || []);

      if (data.departments?.length > 0 && !selectedDeptId) {
        const firstDept = data.departments[0];
        setSelectedDeptId(firstDept._id);
        
        const firstClass = data.classes.find(c => 
          (c.department?._id || c.department) === firstDept._id
        );
        if (firstClass) setSelectedClassId(firstClass._id);
      }
    } catch (e) { 
      console.error("Load error", e); 
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const markAttendance = async (id) => {
    const student = students.find(s => s._id === id);
    let currentStatus = student.status || "Present";
    let nextStatus = "Present";

    if (currentStatus === "Present") nextStatus = "Absent";
    else if (currentStatus === "Absent") nextStatus = "Late";
    else if (currentStatus === "Late") nextStatus = "Present";

    try {
      const response = await fetch(`${API_URL}/students/attendance/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      
      if (response.ok) {
        setStudents(prev => prev.map(s => s._id === id ? { ...s, status: nextStatus } : s));
      }
    } catch (e) { 
      console.error("Patch error", e); 
    }
  };

  const t = (en, ur) => (language === 'ENG' ? en : ur);
  const isUrdu = language === 'URD';

  const filteredClasses = classes.filter(c => 
    (c.department?._id || c.department) === selectedDeptId
  );
  
  const filteredStudents = students.filter(s => 
    (s.className?._id || s.className) === selectedClassId
  );
  
  const presentCount = filteredStudents.filter(s => (s.status || "Present") === "Present").length;
  const absentCount = filteredStudents.filter(s => s.status === "Absent").length;
  const lateCount = filteredStudents.filter(s => s.status === "Late").length;

  return (
    <View style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={[styles.headerContent, isUrdu && { flexDirection: 'row-reverse' }]}>
          <View style={[styles.logoGroup, isUrdu && { flexDirection: 'row-reverse' }]}>
            <View style={styles.logoCircle}>
              <Image source={require('../../../assets/Nadwa_logo.svg')} style={styles.logoImg} />
            </View>
            <Text style={[styles.headerTitle, isUrdu && { marginRight: 10 }]}>{t("Nadwatul Ulama (ATTENDANCE PANEL FOR TEACHERS)", "ندوۃ العلماء (اساتذہ حاضری پینل)")}</Text>
          </View>
          
          <View style={[styles.headerActions, isUrdu && { flexDirection: 'row-reverse' }]}>
            {/* Language Toggle */}
            <TouchableOpacity onPress={() => setLanguage(language === 'ENG' ? 'URD' : 'ENG')} style={styles.langBtn}>
              <Text style={styles.langText}>{language === 'ENG' ? 'اردو' : 'English'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Ionicons name="log-out-outline" size={26} color="#D4AF37" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* TOP FILTERS */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipRow, isUrdu && { flexDirection: 'row-reverse' }]}>
          {departments.map(d => (
            <TouchableOpacity key={d._id} onPress={() => {
              setSelectedDeptId(d._id);
              const firstClass = classes.find(c => (c.department?._id || c.department) === d._id);
              setSelectedClassId(firstClass ? firstClass._id : "");
            }} style={[styles.chip, selectedDeptId === d._id && styles.activeChip]}>
              <Text style={selectedDeptId === d._id ? styles.activeText : styles.chipText}>{d.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={[styles.classRow, isUrdu && { flexDirection: 'row-reverse' }]}>
          {filteredClasses.map(c => (
            <TouchableOpacity key={c._id} onPress={() => setSelectedClassId(c._id)} style={[styles.classBtn, selectedClassId === c._id && styles.activeClassBtn]}>
              <Text style={selectedClassId === c._id ? styles.activeText : styles.chipText}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SUMMARY CARD */}
      <View style={[styles.summaryCard, isUrdu && { flexDirection: 'row-reverse' }]}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{presentCount}</Text>
          <Text style={styles.summaryLabel}>{t("PRESENT", "حاضر")}</Text>
        </View>
        <View style={[styles.summaryItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#eee' }]}>
          <Text style={[styles.summaryNum, { color: '#8b0000' }]}>{absentCount}</Text>
          <Text style={styles.summaryLabel}>{t("ABSENT", "غیر حاضر")}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNum, { color: '#D4AF37' }]}>{lateCount}</Text>
          <Text style={styles.summaryLabel}>{t("LATE", "تاخیر")}</Text>
        </View>
      </View>

      {/* SCROLLABLE LIST */}
      <View style={styles.listWrapper}>
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          alwaysBounceVertical={true}
        >
          {filteredStudents.length > 0 ? (
            filteredStudents.map((item, index) => (
              <TouchableOpacity 
                key={item._id} 
                style={[styles.studentCard, isUrdu && { flexDirection: 'row-reverse', borderLeftWidth: 0, borderRightWidth: 4, borderRightColor: '#D4AF37' }]} 
                onPress={() => markAttendance(item._id)}
              >
                <View style={isUrdu && { alignItems: 'flex-end' }}>
                  <Text style={styles.studentName}>{index + 1}. {item.name}</Text>
                  <Text style={styles.statusLabel}>{t(item.status || "Present", item.status === "Absent" ? "غیر حاضر" : item.status === "Late" ? "تاخیر" : "حاضر")}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Absent' ? '#8b0000' : item.status === 'Late' ? '#D4AF37' : '#006400' }]}>
                  <Text style={styles.statusText}>
                    {t((item.status || "PRESENT").toUpperCase(), item.status === "Absent" ? "غیر حاضر" : item.status === "Late" ? "لیٹ" : "حاضر")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={50} color="#ccc" />
              <Text style={styles.emptyMsg}>
                {selectedClassId ? t("No students found.", "کوئی طالب علم نہیں ملا۔") : t("Please select class.", "براہ کرم کلاس منتخب کریں۔")}
              </Text>
            </View>
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f4f4f4",
    height: Platform.OS === 'web' ? '100vh' : '100%',
    width: '100%',
    position: Platform.OS === 'web' ? 'fixed' : 'relative',
    overflow: 'hidden'
  },
  header: { 
    height: 70, 
    backgroundColor: '#004d00', 
    paddingHorizontal: 15, 
    justifyContent: 'center', 
    borderBottomWidth: 3, 
    borderBottomColor: '#D4AF37',
    zIndex: 10 
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoGroup: { flexDirection: 'row', alignItems: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  langBtn: { borderWidth: 1, borderColor: '#D4AF37', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  langText: { color: '#D4AF37', fontSize: 12, fontWeight: 'bold' },
  logoCircle: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  logoImg: { width: '75%', height: '75%' },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  
  filterSection: { backgroundColor: '#fff', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee', flexShrink: 0 },
  chipRow: { flexDirection: 'row', marginBottom: 10 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#eee', borderRadius: 20, marginRight: 8 },
  activeChip: { backgroundColor: '#006400' },
  classRow: { flexDirection: 'row', gap: 5 },
  classBtn: { flex: 1, alignItems: 'center', padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  activeClassBtn: { backgroundColor: '#D4AF37' },
  chipText: { fontSize: 12, color: '#333' },
  activeText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  
  summaryCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 15, borderRadius: 10, padding: 15, elevation: 2, flexShrink: 0 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 22, fontWeight: 'bold', color: '#006400' },
  summaryLabel: { fontSize: 10, color: '#666', fontWeight: 'bold' },
  
  listWrapper: { flex: 1, width: '100%', overflow: 'hidden' },
  scrollContent: { paddingHorizontal: 15, paddingBottom: 60, flexGrow: 1 },
  
  studentCard: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderLeftWidth: 4, borderLeftColor: '#D4AF37' },
  studentName: { fontSize: 16, fontWeight: '600' },
  statusLabel: { fontSize: 10, color: '#999', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, minWidth: 90, alignItems: 'center' },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyMsg: { color: '#999', marginTop: 10, textAlign: 'center' }
});

export default AttendanceScreen;
