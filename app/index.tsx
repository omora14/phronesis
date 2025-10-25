import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
 
export default function IndexScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
 
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(() => router.replace("/carousel" as any), 300);
    });
  }, []);
 
  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });
 
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Icon - Place your logo at: assets/images/logo.png */}
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
 
        {/* App Name */}
        <Text style={styles.appName}>PHRONESIS</Text>
      </Animated.View>
 
      {/* Progress Bar at Bottom */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground} />
        <Animated.View
          style={[styles.progressBarFill, { width: progressBarWidth }]}
        />
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faefde",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 250,
  },
  appName: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 3,
    marginTop: 28,
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 100,
    width: "55%",
    height: 5,
  },
  progressBarBackground: {
    position: "absolute",
    width: "100%",
    height: 5,
    backgroundColor: "#E5DCC8",
    borderRadius: 3,
  },
  progressBarFill: {
    position: "absolute",
    height: 5,
    backgroundColor: "#2a2a2a",
    borderRadius: 3,
  },
});