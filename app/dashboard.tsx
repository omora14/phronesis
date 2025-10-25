import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { auth, db } from "../firebase";
 
const { width } = Dimensions.get("window");
 
// Home Icon
function HomeIcon({ active = false }: { active?: boolean }) {
  return (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 9 L 12 2 L 21 9 V 20 C 21 20.5304 20.7893 21.0391 20.4142 21.4142 C 20.0391 21.7893 19.5304 22 19 22 H 5 C 4.46957 22 3.96086 21.7893 3.58579 21.4142 C 3.21071 21.0391 3 20.5304 3 20 V 9 Z"
        stroke={active ? "#1a1a1a" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 9 22 V 12 H 15 V 22"
        stroke={active ? "#1a1a1a" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// Profile Icon
function ProfileIcon({ active = false }: { active?: boolean }) {
  return (
    <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 20 21 V 19 C 20 17.9391 19.5786 16.9217 18.8284 16.1716 C 18.0783 15.4214 17.0609 15 16 15 H 8 C 6.93913 15 5.92172 15.4214 5.17157 16.1716 C 4.42143 16.9217 4 17.9391 4 19 V 21"
        stroke={active ? "#1a1a1a" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 12 11 C 14.2091 11 16 9.20914 16 7 C 16 4.79086 14.2091 3 12 3 C 9.79086 3 8 4.79086 8 7 C 8 9.20914 9.79086 11 12 11 Z"
        stroke={active ? "#1a1a1a" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// Camera/Video Icon for Record Button
function CameraIcon() {
  return (
    <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 23 7 L 16 12 L 23 17 V 7 Z"
        fill="#faefde"
      />
      <Path
        d="M 15 5 H 3 C 1.89543 5 1 5.89543 1 7 V 17 C 1 18.1046 1.89543 19 3 19 H 15 C 16.1046 19 17 18.1046 17 17 V 7 C 17 5.89543 16.1046 5 15 5 Z"
        stroke="#faefde"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#faefde"
      />
    </Svg>
  );
}
 
// Leaf Icon
function LeafIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 11 20 A 7 7 0 0 1 9.8 6.1 C 15.5 5 17 4.48 19 2 C 19 2 20.2 5.4 19.9 10.5 A 9.85 9.85 0 0 1 11 20 Z"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M 10.2 12 C 10.2 12 11 13 13 13"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}
 
// Smiley Face Icon
function SmileyIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke="#4CAF50"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M 8 14 C 8 14 9.5 16 12 16 C 14.5 16 16 14 16 14"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="9" cy="9" r="1" fill="#4CAF50" />
      <Circle cx="15" cy="9" r="1" fill="#4CAF50" />
    </Svg>
  );
}
 
// Checkmark Icon
function CheckIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="10"
        stroke="#4CAF50"
        strokeWidth="2"
        fill="none"
      />
      <Path
        d="M 8 12 L 11 15 L 16 9"
        stroke="#4CAF50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
 
// Up Arrow Icon
function UpArrowIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 12 19 V 5 M 5 12 L 12 5 L 19 12"
        stroke="#4CAF50"
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
      <Path
        d="M 10 8 L 16 12 L 10 16 Z"
        fill="#1a1a1a"
      />
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
 
// Circular Progress Component
function CircularProgress({
  score,
  size = 200,
}: {
  score: number;
  size?: number;
}) {
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
 
  // Determine color based on score
  let color = "#4CAF50"; // Green
  if (score < 40) {
    color = "#FF5252"; // Red
  } else if (score < 70) {
    color = "#FFC107"; // Yellow
  }
 
  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E5DCC8"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${progress} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}
 
export default function DashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string }>();

  // Dynamic data - calculated from recordings
  const [todayScore, setTodayScore] = useState(0);
  const [scoreChange, setScoreChange] = useState(0);
  const [recommendation, setRecommendation] = useState(
    "Record your first video to get personalized recommendations!"
  );
  const [topEmotion, setTopEmotion] = useState("Unknown");
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  const [journalText, setJournalText] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Calculate stats from recordings
  const calculateStats = (recordingsData: Recording[]) => {
    if (recordingsData.length === 0) {
      setTodayScore(0);
      setScoreChange(0);
      setTopEmotion("Unknown");
      setWeeklyAverage(0);
      setRecommendation("Record your first video to get personalized recommendations!");
      return;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    // Filter recordings with sentiment scores
    const recordingsWithSentiment = recordingsData.filter(r => r.sentimentScore != null);

    // Today's recordings
    const todayRecordings = recordingsWithSentiment.filter(r => {
      const recDate = r.timestamp.toDate();
      return recDate >= todayStart;
    });

    // Yesterday's recordings
    const yesterdayRecordings = recordingsWithSentiment.filter(r => {
      const recDate = r.timestamp.toDate();
      return recDate >= yesterdayStart && recDate < todayStart;
    });

    // This week's recordings
    const weekRecordings = recordingsWithSentiment.filter(r => {
      const recDate = r.timestamp.toDate();
      return recDate >= weekStart;
    });

    // Calculate today's score (average of today's sentiment scores, normalized to 0-100)
    const todayAvg = todayRecordings.length > 0
      ? todayRecordings.reduce((sum, r) => sum + (r.sentimentScore || 0), 0) / todayRecordings.length
      : 0;
    const normalizedTodayScore = Math.round(Math.max(0, Math.min(100, (todayAvg + 1) * 50)));
    setTodayScore(normalizedTodayScore);

    // Calculate yesterday's score for comparison
    const yesterdayAvg = yesterdayRecordings.length > 0
      ? yesterdayRecordings.reduce((sum, r) => sum + (r.sentimentScore || 0), 0) / yesterdayRecordings.length
      : 0;
    const normalizedYesterdayScore = Math.round(Math.max(0, Math.min(100, (yesterdayAvg + 1) * 50)));
    setScoreChange(normalizedTodayScore - normalizedYesterdayScore);

    // Calculate weekly average
    const weekAvg = weekRecordings.length > 0
      ? weekRecordings.reduce((sum, r) => sum + (r.sentimentScore || 0), 0) / weekRecordings.length
      : 0;
    const normalizedWeekScore = Math.round(Math.max(0, Math.min(100, (weekAvg + 1) * 50)));
    setWeeklyAverage(normalizedWeekScore);

    // Find most common emotion this week
    const emotions = weekRecordings
      .map(r => r.emotion)
      .filter(e => e != null);
    
    if (emotions.length > 0) {
      const emotionCounts: { [key: string]: number } = {};
      emotions.forEach(emotion => {
        if (emotion) {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        }
      });
      const topEmotionEntry = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
      setTopEmotion(topEmotionEntry[0]);
    } else {
      setTopEmotion("Unknown");
    }

    // Generate recommendation based on score
    if (normalizedTodayScore < 40) {
      setRecommendation(
        "Your emotional wellness could use some support. Try taking a short walk, practicing deep breathing, or reaching out to a friend."
      );
    } else if (normalizedTodayScore < 70) {
      setRecommendation(
        "You're doing okay! Consider doing something you enjoy today - listen to music, read a book, or practice gratitude."
      );
    } else {
      setRecommendation(
        "You're doing great! Keep up the positive momentum. Share your joy with others or try something new today."
      );
    }
  };

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
      // Sort by timestamp in JavaScript instead of Firestore query
      recordingsData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      setRecordings(recordingsData);
      
      // Calculate stats whenever recordings change
      calculateStats(recordingsData);
    });

    return () => unsubscribe();
  }, []);

  const handleRecord = () => {
    router.push("/record" as any);
  };

  const handleProfile = () => {
    router.push("/profile" as any);
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
 
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.pageTitle}>Your Progress Today</Text>
 
        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.circleWrapper}>
            <CircularProgress score={todayScore} size={220} />
            <View style={styles.scoreOverlay}>
              {scoreChange > 0 && <UpArrowIcon />}
              <Text style={styles.scoreNumber}>{todayScore}</Text>
              {scoreChange !== 0 && (
                <Text style={styles.scoreChange}>
                  {scoreChange > 0 ? '+' : ''}{scoreChange} points from yesterday
                </Text>
              )}
            </View>
          </View>
        </View>
 
        {/* Recommendation Card */}
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <LeafIcon />
            <Text style={styles.recommendationTitle}>
              Phronesis Recommendation
            </Text>
          </View>
          <Text style={styles.recommendationText}>{recommendation}</Text>
        </View>
 
        {/* Journal Input */}
        <TouchableOpacity style={styles.journalInputContainer}>
          <TextInput
            style={styles.journalInput}
            placeholder="Tap here to reflect on your day..."
            placeholderTextColor="#999"
            multiline
            value={journalText}
            onChangeText={setJournalText}
          />
        </TouchableOpacity>
 
        {/* This Week's Snapshot */}
        <View style={styles.snapshotSection}>
          <Text style={styles.snapshotTitle}>This Week's Snapshot</Text>
          <View style={styles.snapshotRow}>
            <View style={styles.snapshotItem}>
              <SmileyIcon />
              <Text style={styles.snapshotText}>
                Top Emotion: {topEmotion}
              </Text>
            </View>
            <View style={styles.snapshotItem}>
              <CheckIcon />
              <Text style={styles.snapshotText}>
                7-Day Average: {weeklyAverage}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Recordings */}
        {recordings.length > 0 && (
          <View style={styles.recordingsSection}>
            <View style={styles.recordingsSectionHeader}>
              <Text style={styles.recordingsTitle}>Recent Recordings</Text>
              {recordings.length > 3 && (
                <TouchableOpacity onPress={() => router.push("/recordings" as any)}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>
            {recordings.slice(0, 3).map((recording) => (
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
                    <Text style={styles.recordingType}>
                      {recording.type === "audio" ? "Audio Recording" : "Video Recording"}
                    </Text>
                    <Text style={styles.recordingDate}>
                      {formatDate(recording.timestamp)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
 
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("home")}
        >
          <HomeIcon active={activeTab === "home"} />
        </TouchableOpacity>
 
        {/* Center Record Button */}
        <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
          <CameraIcon />
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.navItem}
          onPress={handleProfile}
        >
          <ProfileIcon active={activeTab === "profile"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faefde",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 120,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  circleWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    paddingBottom: 40,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  scoreChange: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  recommendationCard: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 32,
    marginBottom: 20,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  recommendationText: {
    fontSize: 15,
    color: "#1a1a1a",
    lineHeight: 22,
  },
  journalInputContainer: {
    marginHorizontal: 32,
    marginBottom: 32,
  },
  journalInput: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    fontSize: 15,
    color: "#999",
    minHeight: 60,
    textAlignVertical: "top",
  },
  snapshotSection: {
    marginHorizontal: 32,
    marginBottom: 20,
  },
  snapshotTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  snapshotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  snapshotItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  snapshotText: {
    fontSize: 14,
    color: "#1a1a1a",
  },
  recordingsSection: {
    marginHorizontal: 32,
    marginBottom: 20,
    marginTop: 16,
  },
  recordingsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recordingsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF5252",
  },
  recordingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    gap: 12,
  },
  playIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  recordingDate: {
    fontSize: 14,
    color: "#666",
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
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#faefde",
    paddingVertical: 16,
    paddingHorizontal: 40,
    paddingBottom: 32,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5DCC8",
  },
  navItem: {
    padding: 8,
  },
  recordButton: {
    backgroundColor: "#FF5252",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});