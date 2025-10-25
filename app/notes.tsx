import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { auth, db } from "../firebase";

const { width } = Dimensions.get("window");

// Back Icon
function BackIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 15 18 L 9 12 L 15 6"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Note Icon
function NoteIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 14 2 H 6 C 5.46957 2 4.96086 2.21071 4.58579 2.58579 C 4.21071 2.96086 4 3.46957 4 4 V 20 C 4 20.5304 4.21071 21.0391 4.58579 21.4142 C 4.96086 21.7893 5.46957 22 6 22 H 18 C 18.5304 22 19.0391 21.7893 19.4142 21.4142 C 19.7893 21.0391 20 20.5304 20 20 V 8 L 14 2 Z"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 14 2 V 8 H 20"
        stroke="#1a1a1a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Delete Icon
function DeleteIcon() {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Path
        d="M 3 6 H 5 H 21"
        stroke="#FF5252"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 8 6 V 4 C 8 3.46957 8.21071 2.96086 8.58579 2.58579 C 8.96086 2.21071 9.46957 2 10 2 H 14 C 14.5304 2 15.0391 2.21071 15.4142 2.58579 C 15.7893 2.96086 16 3.46957 16 4 V 6 M 19 6 V 20 C 19 20.5304 18.7893 21.0391 18.4142 21.4142 C 18.0391 21.7893 17.5304 22 17 22 H 7 C 6.46957 22 5.96086 21.7893 5.58579 21.4142 C 5.21071 21.0391 5 20.5304 5 20 V 6 H 19 Z"
        stroke="#FF5252"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface Note {
  id: string;
  content: string;
  timestamp: Timestamp;
  userId: string;
}

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData: Note[] = [];
      snapshot.forEach((doc) => {
        notesData.push({ id: doc.id, ...doc.data() } as Note);
      });
      notesData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteNote = async (noteId: string) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "notes", noteId));
              Alert.alert("Success", "Note deleted!");
            } catch (error) {
              console.error("Error deleting note:", error);
              Alert.alert("Error", "Failed to delete note");
            }
          },
        },
      ]
    );
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
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/dashboard" as any)} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>My Notes</Text>
        </View>

        {/* Notes List */}
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <NoteIcon />
            <Text style={styles.emptyStateText}>No notes yet. Start journaling on your dashboard!</Text>
          </View>
        ) : (
          <View style={styles.notesList}>
            {notes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={styles.noteIconContainer}>
                    <NoteIcon />
                  </View>
                  <View style={styles.noteMetaContainer}>
                    <Text style={styles.noteDate}>{formatDate(note.timestamp)}</Text>
                    <Text style={styles.noteTime}> • {formatTime(note.timestamp)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteNote(note.id)}
                  >
                    <DeleteIcon />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteContent}>{note.content}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  notesList: {
    paddingHorizontal: 20,
  },
  noteCard: {
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
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  noteIconContainer: {
    marginRight: 12,
  },
  noteMetaContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  noteDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  noteTime: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
  },
  noteContent: {
    fontSize: 15,
    color: "#1a1a1a",
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
});

