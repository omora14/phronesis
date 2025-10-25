import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../firebase";

export default function LoginScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    try {
      let userCred;
      if (mode === "signup") {
        userCred = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCred = await signInWithEmailAndPassword(auth, email, password);
      }

      // after auth success → go to profile setup and pass uid
      router.replace({
        pathname: "/profileSetup",
        params: { uid: userCred.user.uid },
      });
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: "600", textAlign: "center" }}>
        Phronesis
      </Text>
      <Text style={{ textAlign: "center", color: "#666", marginBottom: 12 }}>
        Sign in to start tracking how you feel.
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: "#999",
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
        }}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#999",
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
        }}
        value={password}
        onChangeText={setPassword}
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
        onPress={handleSubmit}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
          {mode === "signup" ? "Create Account" : "Log In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          setMode(mode === "signup" ? "login" : "signup")
        }
      >
        <Text style={{ textAlign: "center", marginTop: 16 }}>
          {mode === "signup"
            ? "Already have an account? Log in"
            : "Need an account? Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
