import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../firebase";
 
export default function ProfileSetupScreen() {
  const router = useRouter();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  async function handleSignUp() {
    setError("");
 
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
 
    try {
      // Create Firebase user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
 
      // Save basic profile data to Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        createdAt: Date.now(),
      });
 
      router.replace({
        pathname: "/onboarding" as any,
        params: { uid: userCred.user.uid },
      });
    } catch (e: any) {
      console.log("SIGNUP ERROR", e);
      setError(e.message);
    }
  }
 
  function handleLogin() {
    router.push("/login" as any);
  }
 
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
 
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Create Account</Text>
 
      {/* Email Input */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
 
      {/* Password Input */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
 
      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
 
      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Log In */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#faefde",
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1a1a1a",
    marginBottom: 16,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  signUpButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonText: {
    color: "#faefde",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1a1a1a",
  },
  dividerText: {
    fontSize: 14,
    color: "#1a1a1a",
    marginHorizontal: 16,
    fontWeight: "600",
  },
  socialButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
  },
  socialButtonText: {
    color: "#faefde",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  loginText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  loginButton: {
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
});