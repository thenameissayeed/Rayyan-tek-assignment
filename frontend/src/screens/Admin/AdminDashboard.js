import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AdminDashboard = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Departments");
  const [language, setLanguage] = useState("ENG");
  
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [nameInput, setNameInput] = useState("");

  const API_URL = "http://localhost:5000/api/public";

  const t = (en, ur) => (language === "ENG" ? en : ur);
  const isUrdu = language === "URD";

  useEffect(() => {
    loadCloudData();
  }, []);

  const loadCloudData = async () => {
    try {
      const response = await fetch(`${API_URL}/all-data`);
      const data = await response.json();
      setDepartments(data.departments || []);
      setClasses(data.classes || []);
      setStudents(data.students || []);

      if (!selectedDeptId && data.departments?.length > 0) {
        setSelectedDeptId(data.departments[0]._id);
      }
    } catch (e) {
      console.error("Fetch error", e);
    }
  };

  const downloadReport = () => {
    try {
      let csvContent = "Department,Class,Student Name,Attendance Status\n";
      students.forEach((s) => {
        const deptName = s.department?.name || "N/A";
        const className = s.className?.name || "N/A";
        const status = s.status || "Present";
        csvContent += `${deptName},${className},${s.name},${status}\n`;
      });

      if (Platform.OS === "web") {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Nadwa_Report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      alert(t("Could not generate report.", "رپورٹ تیار نہیں کی جا سکی۔"));
    }
  };

  const performDelete = async (id) => {
    let type = activeTab.toLowerCase();
    try {
      const response = await fetch(`${API_URL}/${type}/delete/${id}`, { method: "DELETE" });
      if (response.ok) loadCloudData();
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    let url = "";
    let method = editMode ? "PATCH" : "POST";
    let bodyData = { name: nameInput };

    if (activeTab === "Departments") {
      url = editMode ? `${API_URL}/departments/edit/${editId}` : `${API_URL}/departments/add`;
    } else if (activeTab === "Classes") {
      url = editMode ? `${API_URL}/classes/edit/${editId}` : `${API_URL}/classes/add`;
      if (!editMode) bodyData.departmentId = selectedDeptId;
    } else {
      url = editMode ? `${API_URL}/students/attendance/${editId}` : `${API_URL}/students/add`;
      if (!editMode) {
        bodyData.departmentId = selectedDeptId;
        bodyData.classId = selectedClassId;
      }
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      if (response.ok) {
        await loadCloudData();
        closeModal();
      }
    } catch (e) { console.error(e); }
  };

  const closeModal = () => {
    setModalVisible(false);
    setNameInput("");
    setEditMode(false);
    setEditId(null);
  };

  const filteredClasses = classes.filter((c) => (c.department?._id || c.department) === selectedDeptId);
  const filteredStudents = students.filter((s) => (s.className?._id || s.className) === selectedClassId);

  const listData = activeTab === "Departments" ? departments : activeTab === "Classes" ? filteredClasses : filteredStudents;

  return (
    <View style={styles.screen}>
      <View style={StyleSheet.absoluteFill}>
        <Image source={require("../../../assets/Nadwa_bg.jpg")} style={styles.bgImage} />
        <View style={styles.overlay} />
      </View>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={[styles.headerContent, isUrdu && { flexDirection: "row-reverse" }]}>
          <View style={[styles.logoGroup, isUrdu && { flexDirection: "row-reverse" }]}>
            <View style={styles.logoCircle}>
              <Image source={require("../../../assets/Nadwa_logo.svg")} style={styles.logoImg} />
            </View>
            <Text style={[styles.headerTitle, isUrdu && { marginRight: 10 }]}>{t("Nadwatul Ulama (ADMIN PANEL)", "ندوۃ العلماء (ایڈمن پینل)")}</Text>
          </View>
          
          <View style={[styles.headerRight, isUrdu && { flexDirection: "row-reverse" }]}>
            <TouchableOpacity onPress={downloadReport} style={styles.iconBtn}>
              <Ionicons name="download-outline" size={22} color="#D4AF37" />
              <Text style={styles.iconLabel}>{t("Report", "رپورٹ")}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => setLanguage(language === "ENG" ? "URD" : "ENG")}
                style={styles.langBadge}
            >
              <Text style={styles.langBadgeText}>{language === "ENG" ? "اردو" : "English"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Ionicons name="log-out-outline" size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.glassCard}>
          <View style={styles.nonScrollableTop}>
            {/* TABS WITH TRANSLATION */}
            <View style={[styles.tabBar, isUrdu && { flexDirection: "row-reverse" }]}>
              {[
                { id: "Departments", en: "Departments", ur: "شعبہ جات" },
                { id: "Classes", en: "Classes", ur: "درجات" },
                { id: "Students", en: "Students", ur: "طلباء" }
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[styles.tabItem, activeTab === tab.id && styles.activeTabItem]}
                >
                  <Text style={[styles.tabText, activeTab === tab.id && { color: "#fff" }]}>
                    {t(tab.en, tab.ur)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.staticPanel}>
              <View style={[styles.row, { justifyContent: "space-between", marginBottom: 10 }, isUrdu && { flexDirection: "row-reverse" }]}>
                <Text style={styles.panelLabel}>
                    {t(`Manage ${activeTab}`, `${t(activeTab, activeTab === "Departments" ? "شعبہ جات" : activeTab === "Classes" ? "درجات" : "طلباء")} کا انتظام`)}
                </Text>
              </View>

              {/* Department Chips */}
              {activeTab !== "Departments" && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipScroll, isUrdu && { flexDirection: 'row-reverse' }]}>
                  {departments.map((d) => (
                    <TouchableOpacity
                      key={d._id}
                      onPress={() => setSelectedDeptId(d._id)}
                      style={[styles.chip, selectedDeptId === d._id && styles.activeGreen]}
                    >
                      <Text style={[styles.chipText, selectedDeptId === d._id && { color: "#fff" }]}>{d.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {/* Class Chips */}
              {activeTab === "Students" && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.chipScroll, isUrdu && { flexDirection: 'row-reverse' }]}>
                  {filteredClasses.map((c) => (
                    <TouchableOpacity
                      key={c._id}
                      onPress={() => setSelectedClassId(c._id)}
                      style={[styles.chip, selectedClassId === c._id && styles.activeGold]}
                    >
                      <Text style={styles.chipText}>{c.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity 
                style={[styles.addNewBtn, isUrdu && { flexDirection: 'row-reverse' }]} 
                onPress={() => { setEditMode(false); setModalVisible(true); }}
              >
                <Ionicons name="add-circle" size={18} color="#fff" />
                <Text style={[styles.addNewText, isUrdu ? { marginRight: 5 } : { marginLeft: 5 }]}>
                    {t("Add New", "نیا شامل کریں")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.scrollWrapper}>
            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={true}
              alwaysBounceVertical={true}
            >
              {listData.map((item, index) => (
                <View key={item._id} style={[styles.card, isUrdu && { flexDirection: "row-reverse", borderLeftWidth: 0, borderRightWidth: 5, borderRightColor: "#D4AF37" }]}>
                  <Text style={styles.studentName}>{index + 1}. {item.name}</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => { setEditMode(true); setEditId(item._id); setNameInput(item.name); setModalVisible(true); }}>
                      <Ionicons name="pencil" size={18} color="#006400" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => performDelete(item._id)}>
                      <Ionicons name="trash" size={18} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      </View>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, isUrdu && { textAlign: 'right' }]}>
                {editMode ? t("Edit", "ترمیم") : t("Add New", "نیا شامل کریں")} {t(activeTab, activeTab === "Departments" ? "شعبہ" : activeTab === "Classes" ? "درجہ" : "طالب علم")}
            </Text>
            <TextInput 
                style={[styles.modalInput, isUrdu && { textAlign: 'right' }]} 
                value={nameInput} 
                onChangeText={setNameInput} 
                placeholder={t("Enter Name...", "نام لکھیں...")} 
                autoFocus 
            />
            <View style={[styles.modalButtons, isUrdu && { flexDirection: "row-reverse" }]}>
              <TouchableOpacity onPress={closeModal} style={styles.cancelBtn}>
                  <Text>{t("Cancel", "منسوخ")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>{t("Save", "محفوظ کریں")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
    position: Platform.OS === 'web' ? 'fixed' : 'relative',
    width: '100%',
    backgroundColor: '#000',
    overflow: 'hidden'
  },
  bgImage: { width: "100%", height: "100%", position: 'absolute' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,35,0,0.85)" },
  
  header: {
    height: 80,
    backgroundColor: "#004d00",
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: "#D4AF37",
    zIndex: 10,
  },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logoGroup: { flexDirection: "row", alignItems: "center" },
  logoCircle: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  logoImg: { width: "75%", height: "75%" },
  headerTitle: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 10 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 15 },
  iconBtn: { alignItems: "center" },
  iconLabel: { color: "#D4AF37", fontSize: 9, marginTop: -2 },
  langBadge: { borderWidth: 1, borderColor: '#D4AF37', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
  langBadgeText: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold' },

  mainContainer: { flex: 1, padding: 15, overflow: 'hidden' },
  glassCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: Platform.OS === 'web' ? 'calc(100vh - 110px)' : 'auto'
  },
  nonScrollableTop: { flexShrink: 0 },
  scrollWrapper: { flex: 1, overflow: 'hidden' },
  listContainer: { padding: 15, flexGrow: 1, paddingBottom: 60 },
  
  tabBar: { flexDirection: "row", backgroundColor: "#eee", padding: 4 },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 12 },
  activeTabItem: { backgroundColor: "#006400" },
  tabText: { fontSize: 12, fontWeight: "bold", color: "#666" },
  staticPanel: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  panelLabel: { fontSize: 12, fontWeight: "bold", color: "#006400" },
  chipScroll: { marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#ddd", borderRadius: 10, marginRight: 8 },
  activeGreen: { backgroundColor: "#006400" },
  activeGold: { backgroundColor: "#D4AF37" },
  chipText: { fontSize: 11, fontWeight: "600" },
  addNewBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#006400", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: "flex-start" },
  addNewText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#D4AF37",
    elevation: 3,
  },
  studentName: { fontSize: 14, fontWeight: "500", color: "#333" },
  cardActions: { flexDirection: "row", alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", maxWidth: 400, backgroundColor: "#fff", borderRadius: 20, padding: 25 },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#006400", marginBottom: 15 },
  modalInput: { borderBottomWidth: 2, borderBottomColor: "#D4AF37", padding: 10, marginBottom: 25 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 20 },
  cancelBtn: { padding: 10 },
  saveBtn: { backgroundColor: "#006400", paddingHorizontal: 25, paddingVertical: 10, borderRadius: 10 },
  row: { flexDirection: "row", alignItems: "center" },
});

export default AdminDashboard;