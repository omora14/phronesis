import { useRouter } from "expo-router";

import { signInWithEmailAndPassword } from "firebase/auth";
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
import Svg, { Path } from "react-native-svg";
import { auth } from "../firebase";
 

export default function LoginScreen() {
  const router = useRouter();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
 
  async function handleLogin() {
    setError("");
 
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      router.replace({
        pathname: "/dashboard" as any,
        params: { name: "User" },
      });
    } catch (e: any) {
      console.log("AUTH ERROR", e);
      setError(e.message);
    }
  }
 
  function handleSignUp() {
    router.push("/profileSetup" as any);
  }
 
  function handleForgotPassword() {
    // TODO: Implement forgot password
    console.log("Forgot password");
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
      <Text style={styles.welcomeText}>Welcome Back</Text>
 
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
 
      {/* Remember Me Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
          {rememberMe && (
            <Svg width="16" height="16" viewBox="0 0 16 16">
              <Path
                d="M 3 8 L 6 11 L 13 4"
                stroke="#faefde"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </TouchableOpacity>
 
      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
 
      {/* Log In Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOG IN</Text>
      </TouchableOpacity>
 
      {/* Forgot Password */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Sign Up */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#1a1a1a",
    backgroundColor: "transparent",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1a1a1a",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#faefde",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  forgotPassword: {
    fontSize: 16,
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 24,
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
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 8,
  },
  signUpText: {
    fontSize: 16,
    color: "#1a1a1a",
  },
  signUpButton: {
    borderWidth: 2,
    borderColor: "#1a1a1a",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
});