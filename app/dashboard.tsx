import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string }>();
  const displayName = params.name || "friend";

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [0.6, 0.4, 0.8, 0.75, 0.9, 0.7, 0.85],
      },
    ],
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 24 }}>
      <View>
        <Text style={{ fontSize: 22, fontWeight: "600" }}>
          Hi, {displayName} 👋
        </Text>
        <Text style={{ fontSize: 16, color: "#444", marginTop: 4 }}>
          Here’s how you've been feeling this week:
        </Text>
      </View>

      <LineChart
        data={data}
        width={Dimensions.get("window").width - 48}
        height={200}
        fromZero
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(90, 141, 238, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        }}
        style={{
          borderRadius: 12,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#5A8DEE",
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
        }}
        onPress={() => router.push("/record")}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Record Now 🎥
        </Text>
      </TouchableOpacity>

      <Text style={{ color: "#666" }}>
        This week you’ve mostly been 😄 calm / happy.
      </Text>
    </View>
  );
}
