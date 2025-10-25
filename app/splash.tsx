import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export default function Splash() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
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
        duration: 2200,
        useNativeDriver: false, // progress width can't use native driver
      }),
    ]).start(() => {
      setTimeout(() => router.replace("/carousel"), 500);
    });
  }, []);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "60%"], 
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          styles.logoContainer,
        ]}
      >
        {/* Use Image for PNG */}
        <Image
          source={require("../assets/images/logo.png")}
          style={{ width: 100, height: 100 }}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf8eb",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#141414",
    borderRadius: 2,
  },
});
