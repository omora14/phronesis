import { Stack } from "expo-router";

export default function RootLayout() {
  return (
<Stack
  screenOptions={{
    headerStyle: { backgroundColor: "#5A8DEE" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontWeight: "600" },
  }}
>
  {/* Splash screen opens first */}
  <Stack.Screen name="splash" options={{ headerShown: false }} />

  <Stack.Screen name="login" options={{ title: "Phronesis Login" }} />
  <Stack.Screen name="profileSetup" options={{ title: "Set Up Profile" }} />
  <Stack.Screen name="dashboard" options={{ title: "Your Week" }} />
  <Stack.Screen name="record" options={{ title: "Record Today" }} />
  <Stack.Screen name="carousel" options={{ title: "Record" }} />
</Stack>
  );
}
