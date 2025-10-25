import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { auth, db } from "../firebase";

// Upload Icon
function UploadIcon() {
  return (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 21 15 V 19 C 21 19.5304 20.7893 20.0391 20.4142 20.4142 C 20.0391 20.7893 19.5304 21 19 21 H 5 C 4.46957 21 3.96086 20.7893 3.58579 20.4142 C 3.21071 20.0391 3 19.5304 3 19 V 15"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 17 8 L 12 3 L 7 8 M 12 3 V 15"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Microphone Icon
function MicrophoneIcon() {
  return (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 12 1 C 10.3431 1 9 2.34315 9 4 V 12 C 9 13.6569 10.3431 15 12 15 C 13.6569 15 15 13.6569 15 12 V 4 C 15 2.34315 13.6569 1 12 1 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 19 10 V 12 C 19 15.866 15.866 19 12 19 C 8.13401 19 5 15.866 5 12 V 10"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 12 19 V 23 M 8 23 H 16"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Close/X Icon
function CloseIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 18 6 L 6 18 M 6 6 L 18 18"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Video Camera Icon
function VideoCameraIcon() {
  return (
    <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 23 7 L 16 12 L 23 17 V 7 Z"
        fill="#1a1a1a"
      />
      <Path
        d="M 15 5 H 3 C 1.89543 5 1 5.89543 1 7 V 17 C 1 18.1046 1.89543 19 3 19 H 15 C 16.1046 19 17 18.1046 17 17 V 7 C 17 5.89543 16.1046 5 15 5 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export default function RecordScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"video" | "audio">("video");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const handleClose = () => {
    router.push("/dashboard" as any);
  };

  // Upload to backend and save to Firestore
  const uploadAndSaveVideo = async (uri: string, type: "video" | "audio") => {
    setIsProcessing(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in to save recordings");
        return;
      }

      let sentimentData = null;

      // Upload to backend for sentiment analysis
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: `recorded.${type === "video" ? "mov" : "m4a"}`,
        type: type === "video" ? "video/quicktime" : "audio/m4a",
      } as any);
      formData.append("uid", user.uid);

      try {
        const res = await fetch("http://10.37.184.147:5000/api/sentiment", {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        const result = await res.json();
        console.log("Sentiment analysis result:", result);
        console.log("🎭 Emotion from backend:", result.emotion);
        console.log("📊 Sentiment score from backend:", result.sentimentScore);
        sentimentData = result;
      } catch (apiError) {
        console.warn("Backend upload failed, saving locally only:", apiError);
      }

      // Save metadata and sentiment data to Firestore
      const recordingData = {
        userId: user.uid,
        videoUri: uri,
        timestamp: new Date(),
        type: type,
        sentiment: sentimentData || null,
        // Store sentiment metrics if available
        sentimentScore: sentimentData?.sentimentScore || null,
        emotion: sentimentData?.emotion || null,
        valence: sentimentData?.valence || null,
        arousal: sentimentData?.arousal || null,
        dominance: sentimentData?.dominance || null,
      };
      
      console.log("💾 Saving to Firestore:", {
        emotion: recordingData.emotion,
        sentimentScore: recordingData.sentimentScore,
      });
      
      await addDoc(collection(db, "recordings"), recordingData);

      Alert.alert(
        "Success",
        "Your recording has been saved!",
        [
          {
            text: "OK",
            onPress: () => router.push("/dashboard" as any),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving recording:", error);
      Alert.alert("Error", "Failed to save recording");
    } finally {
      setIsProcessing(false);
    }
  };

  // Record video using native camera
  const recordVideo = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Camera permission is required to record videos");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        await uploadAndSaveVideo(uri, "video");
      }
    } catch (error) {
      console.error("Video recording error:", error);
      Alert.alert("Error", "Failed to record video");
    }
  };

  // Record audio
  const startAudioRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Required", "Microphone permission is required to record audio");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingObj = new Audio.Recording();
      await recordingObj.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recordingObj.startAsync();
      setRecording(recordingObj);
      Alert.alert("Recording", "Audio recording started. Tap 'Stop Recording' when done.");
    } catch (error) {
      console.error("Audio recording error:", error);
      Alert.alert("Error", "Failed to start audio recording");
    }
  };

  const stopAudioRecording = async () => {
    if (!recording) return;
    
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      if (uri) {
        await uploadAndSaveVideo(uri, "audio");
      }
    } catch (error) {
      console.error("Stop recording error:", error);
      Alert.alert("Error", "Failed to stop recording");
    }
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <CloseIcon />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>Record your day</Text>

      {/* Mode Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, mode === "video" && styles.modeButtonActive]}
          onPress={() => setMode("video")}
          disabled={isProcessing || recording !== null}
        >
          <Text style={[styles.modeButtonText, mode === "video" && styles.modeButtonTextActive]}>
            Video
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === "audio" && styles.modeButtonActive]}
          onPress={() => setMode("audio")}
          disabled={isProcessing || recording !== null}
        >
          <Text style={[styles.modeButtonText, mode === "audio" && styles.modeButtonTextActive]}>
            Audio
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recording Area */}
      <View style={styles.recordingArea}>
        {!isProcessing ? (
          <>
            <VideoCameraIcon />
            <Text style={styles.instructionText}>
              {mode === "video" 
                ? "Tap the button below to open your camera and record a video"
                : recording 
                ? "Recording in progress..."
                : "Tap the button below to start audio recording"}
            </Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#1a1a1a" />
            <Text style={styles.processingText}>Processing your recording...</Text>
          </>
        )}
      </View>

      {/* Control Bar */}
      <View style={styles.controlBar}>
        <View style={styles.iconButton} />

        {/* Large Record Button */}
        {mode === "video" ? (
          <TouchableOpacity
            style={[styles.recordButton, isProcessing && styles.recordButtonDisabled]}
            onPress={recordVideo}
            disabled={isProcessing}
          >
            <View style={styles.recordButtonInner} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.recordButton,
              recording && styles.recordButtonActive,
              isProcessing && styles.recordButtonDisabled
            ]}
            onPress={recording ? stopAudioRecording : startAudioRecording}
            disabled={isProcessing}
          >
            <View style={recording ? styles.recordButtonInnerStop : styles.recordButtonInner} />
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setMode(mode === "video" ? "audio" : "video")}
          disabled={isProcessing || recording !== null}
        >
          {mode === "video" ? <MicrophoneIcon /> : <UploadIcon />}
        </TouchableOpacity>
      </View>

      {/* Recording indicator for audio */}
      {recording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.redDot} />
          <Text style={styles.recordingText}>Recording audio...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faefde",
    alignItems: "center",
    paddingTop: 60,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 32,
    zIndex: 10,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
    textAlign: "center",
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#E5DCC8",
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: "#fff",
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#1a1a1a",
  },
  recordingArea: {
    width: "85%",
    aspectRatio: 3 / 4,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#1a1a1a",
    backgroundColor: "#fff",
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
    lineHeight: 24,
  },
  processingText: {
    fontSize: 16,
    color: "#1a1a1a",
    textAlign: "center",
    marginTop: 16,
  },
  controlBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "85%",
    paddingVertical: 20,
  },
  iconButton: {
    padding: 12,
    width: 52,
    alignItems: "center",
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FF5252",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: "#D32F2F",
  },
  recordButtonDisabled: {
    backgroundColor: "#BDBDBD",
    opacity: 0.6,
  },
  recordButtonInner: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  recordButtonInnerStop: {
    width: 28,
    height: 28,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  recordingIndicator: {
    position: "absolute",
    bottom: 140,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF5252",
  },
  recordingText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
