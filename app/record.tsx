import { Audio } from "expo-av";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecordScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState("video"); // "audio" or "video"
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
    })();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  const startRecording = async () => {
    try {
      if (mode === "video" && cameraRef.current) {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        setRecordedUri(video.uri);
        setIsRecording(false);
      } else if (mode === "audio") {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingRef.current = recording;
        setIsRecording(true);
      }
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const stopRecording = async () => {
    if (mode === "video" && cameraRef.current) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    } else if (mode === "audio" && recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecordedUri(uri);
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 Record your {mode}</Text>

      {/* Switch between audio/video */}
      <View style={styles.switchRow}>
        <Button
          title="Video"
          onPress={() => setMode("video")}
          disabled={mode === "video"}
        />
        <Button
          title="Audio"
          onPress={() => setMode("audio")}
          disabled={mode === "audio"}
        />
      </View>

      {/* Video Camera */}
      {mode === "video" && (
        <CameraView ref={cameraRef} style={styles.camera} facing="front" />
      )}

      {/* Record/Stop Button */}
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.stopButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "Stop" : "Record"}
        </Text>
      </TouchableOpacity>

      {/* Preview */}
      {recordedUri && (
        <View style={{ marginTop: 20 }}>
          <Text>File saved at:</Text>
          <Text style={styles.uri}>{recordedUri}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  camera: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    overflow: "hidden",
  },
  recordButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
    width: 120,
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uri: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginTop: 5,
  },
});
