import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const LandingScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [language, setLanguage] = useState('ENG');

  const t = (en, ur) => (language === 'ENG' ? en : ur);
  const isUrdu = language === 'URD';

  const departments = [
    { 
        title: t("Islamic Studies", "اسلامی علوم"), 
        desc: t("Quranic sciences and Fiqh.", "قرآنی علوم اور فقہ"), 
        longDesc: t(
            "Islamic Studies is the study of Islam and its teachings. It helps us understand the Quran, the life of Prophet Muhammad (peace be upon him), and the basic beliefs and practices of Islam.",
            "اسلامی علوم اسلام اور اس کی تعلیمات کا مطالعہ ہے۔ یہ ہمیں قرآن، حضرت محمد مصطفیٰ صلی اللہ علیہ وسلم کی زندگی، اور اسلام کے بنیادی عقائد اور طریقوں کو سمجھنے میں مدد دیتا ہے۔"
        ), 
        color: "#FF5722", icon: "book" 
    },
    { 
        title: t("Arabic Language", "عربی زبان"), 
        desc: t("Classical Arabic & literature.", "قدیم عربی اور ادب"), 
        longDesc: t(
            "Arabic Language focuses on understanding, reading, and writing Arabic. It helps students study classical and modern Arabic texts.",
            "عربی زبان عربی کو سمجھنے، پڑھنے اور لکھنے پر توجہ مرکوز کرتی ہے۔ یہ طلباء کو کلاسیکی اور جدید عربی متن کا مطالعہ کرنے میں مدد دیتی ہے۔"
        ), 
        color: "#9C27B0", icon: "language" 
    },
    { 
        title: t("Computer Science", "کمپیوٹر سائنس"), 
        desc: t("Foundational computing.", "بنیادی کمپیوٹنگ"), 
        longDesc: t(
            "Computer Science is the study of computers and programming. It focuses on problem-solving using algorithms and software development.",
            "کمپیوٹر سائنس کمپیوٹر اور پروگرامنگ کا مطالعہ ہے۔ یہ الگورتھم اور سافٹ ویئر ڈویلپمنٹ کا استعمال کرتے ہوئے مسائل حل کرنے پر توجہ مرکوز کرتا ہے۔"
        ), 
        color: "#3F51B5", icon: "desktop" 
    },
  ];

  const modernDepartments = [
    { 
        title: t("Machine Learning", "مشین لرننگ"), 
        desc: t("Neural networks & AI.", "نیورل نیٹ ورکس اور اے آئی"), 
        longDesc: t(
            "Machine Learning enables computers to learn from data. It focuses on algorithms and pattern recognition.",
            "مشین لرننگ کمپیوٹر کو ڈیٹا سے سیکھنے کے قابل بناتی ہے۔ یہ الگورتھم اور پیٹرن کی شناخت پر توجہ مرکوز کرتی ہے۔"
        ), 
        color: "#00C853", icon: "hardware-chip" 
    },
    { 
        title: t("Data Science", "ڈیٹا سائنس"), 
        desc: t("Big data & statistics.", "بگ ڈیٹا اور شماریات"), 
        longDesc: t(
            "Data Science involves analyzing large amounts of data to extract meaningful insights for decision making.",
            "ڈیٹا سائنس میں فیصلہ سازی کے لیے معنی خیز بصیرت حاصل کرنے کے لیے ڈیٹا کی بڑی مقدار کا تجزیہ کرنا شامل ہے۔"
        ), 
        color: "#00B0FF", icon: "bar-chart" 
    },
    { 
        title: t("BA in Urdu", "بی اے اردو"), 
        desc: t("Urdu poetry & prose.", "اردو شاعری اور نثر"), 
        longDesc: t(
            "BA in Urdu is an undergraduate program focusing on the study of Urdu language, literature, and poetry.",
            "بی اے اردو ایک انڈرگریجویٹ پروگرام ہے جو اردو زبان، ادب اور شاعری کے مطالعہ پر توجہ مرکوز کرتا ہے۔"
        ), 
        color: "#FF9800", icon: "pencil" 
    },
  ];

  const renderCard = (item) => (
    <View key={item.title} style={styles.cardWrapper}>
      <Pressable onPress={() => { setSelectedCourse(item); setModalVisible(true); }}>
          <View style={styles.card}>
            <View style={[styles.cardHeader, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={35} color="#fff" />
              <View style={styles.curveOverlay} />
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.cardTitle, isUrdu && { textAlign: 'center' }]}>{item.title}</Text>
              <Text style={[styles.cardDesc, isUrdu && { textAlign: 'center' }]}>{item.desc}</Text>
              <View style={[styles.readMoreBtn, { backgroundColor: item.color }]}>
                <Text style={styles.readMoreText}>{t("Read More", "مزید پڑھیں")}</Text>
              </View>
            </View>
          </View>
      </Pressable>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={[styles.footerContent, isUrdu && { flexDirection: 'row-reverse' }]}>
        {/* Branding */}
        <View style={styles.footerColumn}>
          <View style={[styles.footerLogoRow, isUrdu && { flexDirection: 'row-reverse' }]}>
            <Image source={require('../../../assets/Nadwa_logo.svg')} style={styles.footerLogo} />
            <Text style={[styles.footerBrandName, isUrdu && { textAlign: 'right' }]}>{t("NADWA", "ندوۃ")}</Text>
          </View>
          <Text style={[styles.footerAboutText, isUrdu && { textAlign: 'right' }]}>
            {t("Islamic and Modern academic excellence since 1894.", "1894 سے اسلامی اور جدید تعلیمی فضیلت۔")}
          </Text>
          <View style={[styles.socialRow, isUrdu && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="logo-facebook" size={20} color="#D4AF37" style={{marginHorizontal: 8}} />
            <Ionicons name="logo-twitter" size={20} color="#D4AF37" style={{marginHorizontal: 8}} />
            <Ionicons name="logo-youtube" size={20} color="#D4AF37" style={{marginHorizontal: 8}} />
          </View>
        </View>

        {/* Quick Links */}
        {!isMobile && (
          <View style={styles.footerColumn}>
            <Text style={[styles.footerHeading, isUrdu && { textAlign: 'right' }]}>{t("QUICK LINKS", "اہم لنکس")}</Text>
            <Text style={[styles.footerLink, isUrdu && { textAlign: 'right' }]}>{t("Admission", "داخلہ")}</Text>
            <Text style={[styles.footerLink, isUrdu && { textAlign: 'right' }]}>{t("Library", "لائبریری")}</Text>
            <Text style={[styles.footerLink, isUrdu && { textAlign: 'right' }]}>{t("Alumni", "سابق طلباء")}</Text>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.footerColumn}>
          <Text style={[styles.footerHeading, isUrdu && { textAlign: 'right' }]}>{t("CONTACT US", "رابطہ کریں")}</Text>
          <View style={[styles.contactRow, isUrdu && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="location" size={16} color="#D4AF37" />
            <Text style={[styles.footerContactText, isUrdu && { textAlign: 'right', marginRight: 8 }]}>{t("Tagore Marg, Lucknow", "ٹیگور مارگ، لکھنؤ")}</Text>
          </View>
          <View style={[styles.contactRow, isUrdu && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="mail" size={16} color="#D4AF37" />
            <Text style={[styles.footerContactText, isUrdu && { textAlign: 'right', marginRight: 8 }]}>info@nadwa.edu</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomBar}>
        <Text style={styles.copyrightText}>© 2026 {t("Darul Uloom Nadwatul Ulama", "دارالعلوم ندوۃ العلماء")}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={StyleSheet.absoluteFill}>
        <Image source={require('../../../assets/Nadwa_bg.jpg')} style={styles.bgImage} resizeMode="cover" />
        <View style={styles.darkOverlay} />
      </View>

      <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={[styles.headerContent, isUrdu && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.headerLeft, isUrdu && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.logoContainer, isUrdu ? { marginLeft: 12 } : { marginRight: 12 }]}>
                <Image source={require('../../../assets/Nadwa_logo.svg')} style={styles.logoImage} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={[styles.collegeName, isUrdu && { textAlign: 'right' }, isMobile && { fontSize: 13 }]}>{t("DARUL ULOOM NADWATUL ULAMA", "دارالعلوم ندوۃ العلماء")}</Text>
                <Text style={[styles.subHeader, isUrdu && { textAlign: 'right' }]}>{t("Student Management System", "اسٹوڈنٹ مینجمنٹ سسٹم")}</Text>
              </View>
            </View>

            <View style={[styles.headerRight, isUrdu && { flexDirection: 'row-reverse' }]}>
              <Pressable style={[styles.langBtn, isUrdu && { flexDirection: 'row-reverse' }]} onPress={() => setLanguage(language === 'ENG' ? 'URD' : 'ENG')}>
                <Ionicons name="globe-outline" size={16} color="#D4AF37" />
                {!isMobile && <Text style={[styles.langText, isUrdu ? { marginRight: 5 } : { marginLeft: 5 }]}>{language === 'ENG' ? "اردو" : "English"}</Text>}
              </Pressable>

              <View>
                <Pressable style={[styles.loginBtn, isUrdu && { flexDirection: 'row-reverse' }]} onPress={() => setDropdownVisible(!dropdownVisible)}>
                  <Text style={[styles.loginLabel, isUrdu ? { marginLeft: 8 } : { marginRight: 8 }]}>{t("LOGIN", "لاگ ان")}</Text>
                  <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={14} color="#D4AF37" />
                </Pressable>
                {dropdownVisible && (
                  <View style={[styles.dropdownMenu, isUrdu ? { left: 0 } : { right: 0 }]}>
                    <Pressable style={[styles.dropdownItem, isUrdu && { flexDirection: 'row-reverse' }]} onPress={() => { setDropdownVisible(false); navigation.navigate("Login", { userRole: "Admin", language: language }); }}>
                      <Ionicons name="person-circle-outline" size={18} color="#006400" />
                      <Text style={[styles.dropdownText, isUrdu ? { marginRight: 10 } : { marginLeft: 10 }]}>{t("Admin Portal", "ایڈمن پورٹل")}</Text>
                    </Pressable>
                    <View style={styles.divider} />
                    <Pressable style={[styles.dropdownItem, isUrdu && { flexDirection: 'row-reverse' }]} onPress={() => { setDropdownVisible(false); navigation.navigate("Login", { userRole: "Teacher", language: language }); }}>
                      <Ionicons name="school-outline" size={18} color="#006400" />
                      <Text style={[styles.dropdownText, isUrdu ? { marginRight: 10 } : { marginLeft: 10 }]}>{t("Teacher Portal", "ٹیچر پورٹل")}</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {dropdownVisible && <Pressable style={styles.outsideClickLayer} onPress={() => setDropdownVisible(false)} />}

        {/* MAIN CONTENT */}
        <View style={styles.content}>
          <View style={styles.glassLabel}>
            <Text style={styles.sectionTitle}>{t("Available Departments", "دستیاب شعبہ جات")}</Text>
          </View>
          <View style={[styles.cardGrid, isUrdu && { flexDirection: 'row-reverse' }]}>
            {departments.map((item) => renderCard(item))}
          </View>

          <View style={[styles.glassLabel, { marginTop: 40 }]}>
            <Text style={styles.sectionTitle}>{t("Modern Academic Programs", "جدید تعلیمی پروگرام")}</Text>
          </View>
          <View style={[styles.cardGrid, isUrdu && { flexDirection: 'row-reverse' }]}>
            {modernDepartments.map((item) => renderCard(item))}
          </View>
          <View style={{ height: 60 }} />
        </View>

        {/* FOOTER */}
        {renderFooter()}
      </ScrollView>

      {/* DETAIL MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" size={32} color="#666" />
            </Pressable>
            {selectedCourse && (
              <View style={{ alignItems: 'center' }}>
                <View style={[styles.modalIconCircle, { backgroundColor: selectedCourse.color }]}>
                   <Ionicons name={selectedCourse.icon} size={40} color="#fff" />
                </View>
                <Text style={[styles.modalTitle, { color: selectedCourse.color }, isUrdu && { textAlign: 'center' }]}>{selectedCourse.title}</Text>
                <Text style={[styles.modalLongDesc, isUrdu && { textAlign: 'right', writingDirection: 'rtl' }]}>{selectedCourse.longDesc}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  bgImage: { width: '100%', height: '100%', position: 'absolute' },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  scrollContent: { flexGrow: 1 },
  header: { backgroundColor: "#006400", paddingVertical: 12, paddingHorizontal: '4%', borderBottomWidth: 4, borderBottomColor: "#D4AF37", zIndex: 100 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logoContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  logoImage: { width: '80%', height: '80%' },
  headerTextContainer: { flexShrink: 1, marginLeft: 10 },
  collegeName: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  subHeader: { color: "#D4AF37", fontSize: 9, fontWeight: '600' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  langBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#D4AF37', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 5 },
  langText: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold' },
  loginBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(212,175,55,0.2)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#D4AF37' },
  loginLabel: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  dropdownMenu: { position: 'absolute', top: 40, width: 160, backgroundColor: '#fff', borderRadius: 8, paddingVertical: 5, elevation: 10, zIndex: 1000 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  dropdownText: { color: '#333', fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginHorizontal: 10 },
  outsideClickLayer: { ...StyleSheet.absoluteFillObject, zIndex: 5 },
  content: { paddingHorizontal: 15, paddingTop: 20 },
  glassLabel: { backgroundColor: 'rgba(255, 255, 255, 0.95)', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 25, alignSelf: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#006400" },
  cardGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  cardWrapper: { margin: 10 },
  card: { backgroundColor: "#fff", width: 280, height: 260, borderRadius: 15, overflow: "hidden", elevation: 5 },
  cardHeader: { height: 80, justifyContent: "center", alignItems: "center" },
  curveOverlay: { position: 'absolute', bottom: -20, width: '120%', height: 40, backgroundColor: '#fff', borderTopLeftRadius: 100, borderTopRightRadius: 100 },
  cardBody: { padding: 15, alignItems: "center", flex: 1, justifyContent: 'space-between' },
  cardTitle: { fontSize: 14, fontWeight: "bold", color: "#333", textAlign: 'center' },
  cardDesc: { fontSize: 11, color: "#666", textAlign: "center" },
  readMoreBtn: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 15 },
  readMoreText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  // FOOTER STYLES
  footerContainer: { backgroundColor: '#1a1a1a', paddingTop: 40, width: '100%', borderTopWidth: 3, borderTopColor: '#D4AF37' },
  footerContent: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: '5%', paddingBottom: 30 },
  footerColumn: { width: Platform.OS === 'web' ? '30%' : '100%', marginBottom: 25, minWidth: 250 },
  footerLogoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  footerLogo: { width: 40, height: 40, marginRight: 10 },
  footerBrandName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  footerAboutText: { color: '#aaa', fontSize: 12, lineHeight: 20 },
  socialRow: { flexDirection: 'row', marginTop: 15 },
  footerHeading: { color: '#D4AF37', fontSize: 13, fontWeight: 'bold', marginBottom: 20 },
  footerLink: { color: '#ccc', fontSize: 12, marginBottom: 10 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  footerContactText: { color: '#ccc', fontSize: 11, marginLeft: 10 },
  bottomBar: { borderTopWidth: 1, borderTopColor: '#333', paddingVertical: 15, alignItems: 'center', backgroundColor: '#111' },
  copyrightText: { color: '#666', fontSize: 10 },
  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", maxWidth: 400, backgroundColor: "#fff", borderRadius: 20, padding: 25 },
  closeBtn: { position: 'absolute', top: 10, right: 10 },
  modalIconCircle: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalLongDesc: { fontSize: 13, color: '#444', lineHeight: 18 },
});

export default LandingScreen;