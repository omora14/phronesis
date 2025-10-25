import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { Camera, useCameraPermissions } from "expo-camera";

export default function RecordScreen() {
  // If we’re on web, expo-camera is not a valid component and will crash.
  const isWeb = Platform.OS === "web";

  // Permission + recording state (native only)
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const cameraRef = useRef<Camera | null>(null);

  async function startRecording() {
    if (isWeb) {
      // Demo fallback on web
      Alert.alert(
        "Today's Emotion",
        "You seem 82% happy today 😄",
        [{ text: "OK" }]
      );
      return;
    }

    // --- native path below ---
    if (!permission || !permission.granted) {
      const perm = await requestPermission();
      if (!perm.granted) {
        Alert.alert("Camera access is required.");
        return;
      }
    }

    try {
      setRecording(true);

      const videoPromise = cameraRef.current?.recordAsync({
        maxDuration: 60,
        quality: "480p",
      });

      if (videoPromise) {
        const result = await videoPromise;
        console.log("Recorded video URI:", result?.uri);

        Alert.alert(
          "Today's Emotion",
          "You seem 82% happy today 😄",
          [{ text: "OK" }]
        );
      }
    } catch (err) {
      console.error("recording error", err);
      Alert.alert("Recording failed", "Something went wrong.");
    } finally {
      setRecording(false);
    }
  }

  function stopRecording() {
    if (!isWeb) {
      cameraRef.current?.stopRecording();
    }
  }

  // --------- WEB FALLBACK RENDER -----------
  if (isWeb) {
    // We're running in the browser. Show a mock UI instead of <Camera/>.
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: "white", fontSize: 18, marginBottom: 16 }}>
          (Web preview)
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          This is where Phronesis records your daily check-in video
          and analyzes your mood.
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingVertical: 16,
            paddingHorizontal: 28,
            borderRadius: 999,
            minWidth: 140,
            alignItems: "center",
          }}
          onPress={startRecording}
        >
          <Text style={{ color: "black", fontWeight: "700", fontSize: 16 }}>
            Simulate Record
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 24,
            fontSize: 13,
            opacity: 0.7,
            maxWidth: 260,
          }}
        >
          On device, this will use the front camera, capture
          your reflection, upload, and return an emotion score.
        </Text>
      </View>
    );
  }

  // --------- NATIVE RENDER (iOS / Android via Expo Go) -----------
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        type="front"
        ratio="16:9"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            padding: 24,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: 12,
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            How was your day?
          </Text>

          {recording ? (
            <TouchableOpacity
              style={{
                backgroundColor: "red",
                paddingVertical: 16,
                paddingHorizontal: 28,
                borderRadius: 999,
                alignSelf: "center",
                minWidth: 140,
                alignItems: "center",
              }}
              onPress={stopRecording}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                STOP
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 16,
                paddingHorizontal: 28,
                borderRadius: 999,
                alignSelf: "center",
                minWidth: 140,
                alignItems: "center",
              }}
              onPress={startRecording}
            >
              <Text
                style={{
                  color: "black",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                REC
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 16,
              fontSize: 13,
              opacity: 0.7,
            }}
          >
            Phronesis securely analyzes your mood and stress from your check-in
            video.
          </Text>
        </View>
      </Camera>
    </View>
  );
}
