import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

export const saveSentimentData = async (
  userId: number,
  transcript: string,
  sentimentScore: number
) => {
  try {
    // reference to the "userData" collection
    const userDataCollectionRef = collection(db, "userData");

    const docRef = doc(userDataCollectionRef);

    await setDoc(docRef, {
      userId,
      transcript,
      sentimentScores: sentimentScore,
      createdAt: Timestamp.now(),
    });

    console.log("Saved sentiment data for user:", userId);
    return docRef.id; // return the document ID to see if this thing finally works
  } catch (err) {
    console.error("Error saving sentiment data:", err);
  }
};
