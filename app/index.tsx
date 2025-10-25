import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // 1. Wait one tick so RootLayout mounts before navigation.
  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. After we're "ready", THEN navigate to /login
  useEffect(() => {
    if (ready) {
      router.replace("/login");
    }
  }, [ready, router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#5A8DEE" />
    </View>
  );
}
