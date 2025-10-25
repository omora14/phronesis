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
      {/* Splash Screen - No Header */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="carousel"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profileSetup"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="dashboard"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="record"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="profile"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="splash"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
 