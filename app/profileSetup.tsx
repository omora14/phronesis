import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ uid?: string }>();
  const uid = params.uid;

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    if (!uid) {
      setError("No user ID found.");
      return;
    }

    setError("");
    try {
      await setDoc(doc(db, "users", uid), {
        name,
        age,
        gender,
        createdAt: Date.now(),
      });

      router.replace({
        pathname: "/dashboard",
        params: { name },
      });
    } catch (e) {
      console.log(e);
      setError("Could not save profile.");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", textAlign: "center" }}>
        Welcome to Phronesis
      </Text>
      <Text style={{ textAlign: "center", color: "#666", marginBottom: 12 }}>
        Help us personalize your emotional insights.
      </Text>

      <TextInput
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#999",
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
        }}
      />

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        style={{
          borderWidth: 1,
          borderColor: "#999",
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
        }}
      />

      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={{
          borderWidth: 1,
          borderColor: "#999",
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
        }}
      />

      {error ? (
        <Text style={{ color: "red", fontSize: 12, textAlign: "center" }}>
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={{
          backgroundColor: "#5A8DEE",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 8,
        }}
        onPress={handleSave}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}
