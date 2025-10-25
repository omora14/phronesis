import { ResizeMode, Video } from "expo-av";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { auth, db } from "../firebase";

const { width } = Dimensions.get("window");

// Back Arrow Icon
function BackIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 19 12 H 5 M 12 19 L 5 12 L 12 5"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Play Icon
function PlayIcon() {
  return (
    <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.9)" />
      <Path d="M 10 8 L 16 12 L 10 16 Z" fill="#1a1a1a" />
    </Svg>
  );
}

// Close Icon
function CloseIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 18 6 L 6 18 M 6 6 L 18 18"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Video Icon
function VideoIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 23 7 L 16 12 L 23 17 V 7 Z"
        fill="#666"
      />
      <Path
        d="M 15 5 H 3 C 1.89543 5 1 5.89543 1 7 V 17 C 1 18.1046 1.89543 19 3 19 H 15 C 16.1046 19 17 18.1046 17 17 V 7 C 17 5.89543 16.1046 5 15 5 Z"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

// Microphone Icon
function MicrophoneIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 12 1 C 10.3431 1 9 2.34315 9 4 V 12 C 9 13.6569 10.3431 15 12 15 C 13.6569 15 15 13.6569 15 12 V 4 C 15 2.34315 13.6569 1 12 1 Z"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M 19 10 V 12 C 19 15.866 15.866 19 12 19 C 8.13401 19 5 15.866 5 12 V 10"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 12 19 V 23 M 8 23 H 16"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface Recording {
  id: string;
  userId: string;
  videoUri: string;
  timestamp: Timestamp;
  type: string;
  sentiment?: any;
  sentimentScore?: number;
  emotion?: string;
  valence?: number;
  arousal?: number;
  dominance?: number;
}

export default function RecordingsScreen() {
  const router = useRouter();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [filter, setFilter] = useState<"all" | "video" | "audio">("all");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch recordings from Firestore
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "recordings"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordingsData: Recording[] = [];
      snapshot.forEach((doc) => {
        recordingsData.push({ id: doc.id, ...doc.data() } as Recording);
      });
      // Sort by timestamp in JavaScript
      recordingsData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      setRecordings(recordingsData);
    });

    return () => unsubscribe();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handlePlayVideo = (videoUri: string) => {
    setSelectedVideo(videoUri);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedVideo(null);
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredRecordings = recordings.filter((recording) => {
    if (filter === "all") return true;
    return recording.type === filter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Recordings</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
            All ({recordings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "video" && styles.filterButtonActive]}
          onPress={() => setFilter("video")}
        >
          <VideoIcon />
          <Text style={[styles.filterText, filter === "video" && styles.filterTextActive]}>
            Videos ({recordings.filter((r) => r.type === "video").length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "audio" && styles.filterButtonActive]}
          onPress={() => setFilter("audio")}
        >
          <MicrophoneIcon />
          <Text style={[styles.filterText, filter === "audio" && styles.filterTextActive]}>
            Audio ({recordings.filter((r) => r.type === "audio").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recordings List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecordings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recordings yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start recording to track your emotional journey
            </Text>
          </View>
        ) : (
          filteredRecordings.map((recording) => (
            <TouchableOpacity
              key={recording.id}
              style={styles.recordingCard}
              onPress={() => handlePlayVideo(recording.videoUri)}
            >
              <View style={styles.recordingContent}>
                <View style={styles.playIconContainer}>
                  <PlayIcon />
                </View>
                <View style={styles.recordingInfo}>
                  <View style={styles.recordingHeader}>
                    <Text style={styles.recordingType}>
                      {recording.type === "audio" ? "Audio Recording" : "Video Recording"}
                    </Text>
                    {recording.emotion && (
                      <View style={styles.emotionBadge}>
                        <Text style={styles.emotionText}>{recording.emotion}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.recordingMeta}>
                    <Text style={styles.recordingDate}>{formatDate(recording.timestamp)}</Text>
                    <Text style={styles.recordingTime}> • {formatTime(recording.timestamp)}</Text>
                  </View>
                  {recording.sentimentScore != null && (
                    <View style={styles.sentimentBar}>
                      <View
                        style={[
                          styles.sentimentFill,
                          {
                            width: `${(() => {
                              const score = recording.sentimentScore || 0;
                              let dramaticScore;
                              if (score >= 0) {
                                dramaticScore = 50 + (Math.pow(score, 0.4) * 48);
                              } else {
                                dramaticScore = 50 - (Math.pow(Math.abs(score), 0.4) * 48);
                              }
                              return Math.max(2, Math.min(98, dramaticScore));
                            })()}%`,
                            backgroundColor:
                              recording.sentimentScore < -0.2
                                ? "#FF5252"
                                : recording.sentimentScore < 0.2
                                ? "#FFC107"
                                : "#4CAF50",
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Video Modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
            <CloseIcon />
          </TouchableOpacity>
          {selectedVideo && (
            <Video
              source={{ uri: selectedVideo }}
              style={styles.videoPlayer}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faefde",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  placeholder: {
    width: 40,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E5DCC8",
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: "#1a1a1a",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  filterTextActive: {
    color: "#faefde",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  recordingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  playIconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  recordingType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  emotionBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emotionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },
  recordingMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recordingDate: {
    fontSize: 14,
    color: "#666",
  },
  recordingTime: {
    fontSize: 14,
    color: "#999",
  },
  sentimentBar: {
    height: 6,
    backgroundColor: "#E5DCC8",
    borderRadius: 3,
    overflow: "hidden",
  },
  sentimentFill: {
    height: "100%",
    borderRadius: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 32,
    zIndex: 10,
    padding: 8,
  },
  videoPlayer: {
    width: width - 40,
    height: (width - 40) * (4 / 3),
    borderRadius: 12,
  },
});

