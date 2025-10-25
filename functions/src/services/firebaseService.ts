import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

export async function saveSentimentScore(userId: string, score: number): Promise<void> {
  const ref = db.collection("userSentiments").doc(userId);
  await ref.set(
    {
      scores: admin.firestore.FieldValue.arrayUnion({
        score,
        timestamp: admin.firestore.Timestamp.now(),
      }),
    },
    { merge: true }
  );
}
