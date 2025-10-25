import * as functions from "firebase-functions";
import { analyzeSentiment } from "./services/aiService";

export const analyzeUserAudio = functions.https.onRequest(async (req, res) => {
  try {
    const { audioUrl, videoUrl } = req.body;

    if (!audioUrl && !videoUrl) {
      res.status(400).json({ error: "audioUrl or videoUrl is required" });
      return;
    }

    const sentiments = await analyzeSentiment({ audioUrl, videoUrl });

    // TODO: Save sentiments to Firestore here

    res.json({ sentiments });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
