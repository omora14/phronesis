import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { auth, db } from "../firebase";
 
// Home Icon
function HomeIcon({ active = false }: { active?: boolean }) {
  return (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 9 L 12 2 L 21 9 V 20 C 21 20.5304 20.7893 21.0391 20.4142 21.4142 C 20.0391 21.7893 19.5304 22 19 22 H 5 C 4.46957 22 3.96086 21.7893 3.58579 21.4142 C 3.21071 21.0391 3 20.5304 3 20 V 9 Z"
        stroke={active ? "#1a1a1a" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 9 22 V 12 H 15 V 22"
        stroke={active ? "#1a1a1a" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// Profile Icon
function ProfileIcon({ active = false }: { active?: boolean }) {
  return (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 20 21 V 19 C 20 17.9391 19.5786 16.9217 18.8284 16.1716 C 18.0783 15.4214 17.0609 15 16 15 H 8 C 6.93913 15 5.92172 15.4214 5.17157 16.1716 C 4.42143 16.9217 4 17.9391 4 19 V 21"
        stroke={active ? "#1a1a1a" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 12 11 C 14.2091 11 16 9.20914 16 7 C 16 4.79086 14.2091 3 12 3 C 9.79086 3 8 4.79086 8 7 C 8 9.20914 9.79086 11 12 11 Z"
        stroke={active ? "#1a1a1a" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// Camera/Video Icon for Record Button
function CameraIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <Path d="M 23 7 L 16 12 L 23 17 V 7 Z" fill="#faefde" />
      <Path
        d="M 15 5 H 3 C 1.89543 5 1 5.89543 1 7 V 17 C 1 18.1046 1.89543 19 3 19 H 15 C 16.1046 19 17 18.1046 17 17 V 7 C 17 5.89543 16.1046 5 15 5 Z"
        stroke="#faefde"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#faefde"
      />
    </Svg>
  );
}
 
// Logout Icon
function LogoutIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 9 21 H 5 C 4.46957 21 3.96086 20.7893 3.58579 20.4142 C 3.21071 20.0391 3 19.5304 3 19 V 5 C 3 4.46957 3.21071 3.96086 3.58579 3.58579 C 3.96086 3.21071 4.46957 3 5 3 H 9"
        stroke="#FF5252"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 16 17 L 21 12 L 16 7"
        stroke="#FF5252"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 21 12 H 9"
        stroke="#FF5252"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// Email Icon
function EmailIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 4 4 H 20 C 21.1 4 22 4.9 22 6 V 18 C 22 19.1 21.1 20 20 20 H 4 C 2.9 20 2 19.1 2 18 V 6 C 2 4.9 2.9 4 4 4 Z"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M 22 6 L 12 13 L 2 6"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// User Icon
function UserIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 20 21 V 19 C 20 17.9391 19.5786 16.9217 18.8284 16.1716 C 18.0783 15.4214 17.0609 15 16 15 H 8 C 6.93913 15 5.92172 15.4214 5.17157 16.1716 C 4.42143 16.9217 4 17.9391 4 19 V 21"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 12 11 C 14.2091 11 16 9.20914 16 7 C 16 4.79086 14.2091 3 12 3 C 9.79086 3 8 4.79086 8 7 C 8 9.20914 9.79086 11 12 11 Z"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// Calendar Icon
function CalendarIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 19 4 H 5 C 3.89543 4 3 4.89543 3 6 V 20 C 3 21.1046 3.89543 22 5 22 H 19 C 20.1046 22 21 21.1046 21 20 V 6 C 21 4.89543 20.1046 4 19 4 Z"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M 16 2 V 6 M 8 2 V 6 M 3 10 H 21"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// Gender Icon (Male/Female symbols)
function GenderIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {/* Male symbol (♂) - circle with arrow */}
      <Path
        d="M 10.5 9.5 C 10.5 11.433 8.933 13 7 13 C 5.067 13 3.5 11.433 3.5 9.5 C 3.5 7.567 5.067 6 7 6 C 8.933 6 10.5 7.567 10.5 9.5 Z"
        stroke="#666"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d="M 9.5 11 L 12 13.5 M 12 10 V 13.5 M 12 10 H 15"
        stroke="#666"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Female symbol (♀) - circle with cross */}
      <Path
        d="M 20.5 9.5 C 20.5 11.433 18.933 13 17 13 C 15.067 13 13.5 11.433 13.5 9.5 C 13.5 7.567 15.067 6 17 6 C 18.933 6 20.5 7.567 20.5 9.5 Z"
        stroke="#666"
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d="M 17 13 V 18 M 15 16 H 19"
        stroke="#666"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
 
export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    createdAt: "",
  });
 
  useEffect(() => {
    loadUserData();
  }, []);
 
  async function loadUserData() {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            name: data.name || "User",
            email: data.email || user.email || "",
            age: data.age ? String(data.age) : "Not set",
            gender: formatGender(data.gender),
            createdAt: data.createdAt
              ? new Date(data.createdAt).toLocaleDateString()
              : "Unknown",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  }
 
  function formatGender(gender: string) {
    if (!gender) return "Not set";
    if (gender === "prefer-not-to-say") return "Prefer not to say";
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  }
 
  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/login" as any);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
 
  const handleRecord = () => {
    router.push("/record" as any);
  };
 
  const handleHome = () => {
    router.push("/dashboard" as any);
  };
 
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Profile</Text>
        </View>
 
        {/* Profile Avatar Circle */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userData.name.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
        </View>
 
        {/* Account Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Account Details</Text>
 
          {/* Email */}
          <View style={styles.detailCard}>
            <EmailIcon />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{userData.email}</Text>
            </View>
          </View>
 
          {/* Name */}
          <View style={styles.detailCard}>
            <UserIcon />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{userData.name}</Text>
            </View>
          </View>
 
          {/* Age */}
          <View style={styles.detailCard}>
            <CalendarIcon />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{userData.age}</Text>
            </View>
          </View>
 
          {/* Gender */}
          <View style={styles.detailCard}>
            <GenderIcon />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{userData.gender}</Text>
            </View>
          </View>
 
          {/* Member Since */}
          <View style={styles.detailCard}>
            <CalendarIcon />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Member Since</Text>
              <Text style={styles.detailValue}>{userData.createdAt}</Text>
            </View>
          </View>
        </View>
 
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogoutIcon />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
 
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <HomeIcon active={activeTab === "home"} />
        </TouchableOpacity>
 
        {/* Center Record Button */}
        <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
          <CameraIcon />
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("profile")}
        >
          <ProfileIcon active={activeTab === "profile"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faefde",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FDF8EB",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  detailsSection: {
    marginHorizontal: 32,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  detailCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#FF5252",
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 32,
    gap: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF5252",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#faefde",
    paddingVertical: 16,
    paddingHorizontal: 40,
    paddingBottom: 32,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5DCC8",
  },
  navItem: {
    padding: 8,
  },
  recordButton: {
    backgroundColor: "#FF5252",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
 