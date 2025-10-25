import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../firebase";
 
type Gender = "female" | "male" | "prefer-not-to-say" | null;
 
export default function OnboardingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ uid?: string }>();
  const uid = params.uid;
 
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>(null);
  const [error, setError] = useState("");
 
  async function handleContinue() {
    if (!name || !age) {
      setError("Please enter your name and age");
      return;
    }
 
    if (!uid) {
      setError("User ID not found");
      return;
    }
 
    try {
      // Update user profile in Firestore
      await updateDoc(doc(db, "users", uid), {
        name,
        age: parseInt(age),
        gender,
        updatedAt: Date.now(),
      });
 
      router.replace({
        pathname: "/dashboard" as any,
        params: { name },
      });
    } catch (e: any) {
      console.log("UPDATE ERROR", e);
      setError("Could not save profile");
    }
  }
 
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Heading */}
      <Text style={styles.heading}>Tell us about yourself</Text>
 
      {/* Name Input */}
      <View style={styles.nameContainer}>
        <Text style={styles.label}>NAME</Text>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#999"
          autoCapitalize="words"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
 
      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
 
      {/* Two Column Layout */}
      <View style={styles.formRow}>
        {/* Age Column */}
        <View style={styles.column}>
          <Text style={styles.label}>AGE</Text>
          <TextInput
            placeholder="Enter age"
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={styles.input}
            value={age}
            onChangeText={setAge}
          />
        </View>
 
        {/* Gender Column */}
        <View style={styles.column}>
          <Text style={styles.label}>GENDER</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setGender("male")}
            >
              <View style={styles.radioCircle}>
                {gender === "male" && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>Male</Text>
            </TouchableOpacity>
 
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setGender("female")}
            >
              <View style={styles.radioCircle}>
                {gender === "female" && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>Female</Text>
            </TouchableOpacity>
 
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setGender("prefer-not-to-say")}
            >
              <View style={styles.radioCircle}>
                {gender === "prefer-not-to-say" && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioLabel}>Prefer not to say</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
 
      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>CONTINUE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faefde",
  },
  contentContainer: {
    padding: 32,
    paddingTop: 175,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 32,
  },
  nameContainer: {
    marginBottom: 24,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 80,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#faefde",
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1a1a1a",
  },
  genderContainer: {
    backgroundColor: "#faefde",
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#1a1a1a",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#1a1a1a",
  },
  radioLabel: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  continueButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#faefde",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});