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
  View,
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
 
  function handleGoogleLogin() {
    // TODO: Implement Google login
    console.log("Google login");
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
 
      {/* OR Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
 
      {/* Social Login Button */}
      <TouchableOpacity
        style={styles.socialButton}
        onPress={handleGoogleLogin}
      >
        <Svg width="20" height="20" viewBox="0 0 20 20" style={styles.socialIcon}>
          <Path
            d="M 19 10.2 C 19 9.5 18.9 8.8 18.8 8.2 H 10 V 12 H 15 C 14.8 13 14.2 14 13.3 14.6 V 17 H 16.3 C 17.9 15.6 19 13.1 19 10.2 Z M 10 19 C 12.4 19 14.4 18.2 16.3 17 L 13.3 14.6 C 12.5 15.1 11.4 15.5 10 15.5 C 7.7 15.5 5.7 14.1 5 12.1 H 2 V 14.6 C 3.9 18.3 6.7 19 10 19 Z M 5 12.1 C 4.5 10.7 4.5 9.3 5 7.9 V 5.4 H 2 C 0.3 8.8 0.3 13.2 2 16.6 L 5 14.1 V 12.1 Z M 10 4.5 C 11.5 4.5 12.9 5 14 6 L 16.6 3.4 C 14.4 1.4 12.4 1 10 1 C 6.7 1 3.9 2.7 2 5.4 L 5 7.9 C 5.7 5.9 7.7 4.5 10 4.5 Z"
            fill="#faefde"
          />
        </Svg>
        <Text style={styles.socialButtonText}>Continue with Google</Text>
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