import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) {
      router.replace("/login");
    }
  }, [ready, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5A8DEE" />
      <Text style={styles.subtitle}>Loading, please wait...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf8eb",
  },
  subtitle: {
    marginTop: 20,
    fontSize: 18,
    color: "#38434D",
  },
});
