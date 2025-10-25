import axios from "axios";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    // use a local audio file (for testing)
    const filePath = path.join(__dirname, "../assets/harvard.mp3");
    const audioStream = fs.createReadStream(filePath);

    // upload to AssemblyAI
    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      audioStream,
      {
        headers: {
          authorization: process.env.ASSEMBLY_API_KEY!,
          "transfer-encoding": "chunked",
        },
      }
    );

    const uploadUrl = uploadResponse.data.upload_url;

    // start transcription + sentiment analysis
    const transcriptResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: uploadUrl,
        sentiment_analysis: true, // <--- this line enables sentiment
      },
      {
        headers: {
          authorization: process.env.ASSEMBLY_API_KEY!,
          "content-type": "application/json",
        },
      }
    );

    const transcriptId = transcriptResponse.data.id;

    // oll until completed
    let transcriptData;
    while (true) {
      const poll = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: process.env.ASSEMBLY_API_KEY! } }
      );

      transcriptData = poll.data;
      if (transcriptData.status === "completed") break;
      if (transcriptData.status === "error") throw new Error(transcriptData.error);
      await new Promise((r) => setTimeout(r, 5000));
    }

    // get sentiment summary
const sentiments = transcriptData.sentiment_analysis_results.map(
  (s: { sentiment: string }) => s.sentiment
);
const total = sentiments.length;
const sentimentCounts: Record<string, number> = sentiments.reduce(
  (acc: Record<string, number>, s: string) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  },
  {}
);

const sentimentScores = Object.entries(sentimentCounts).map(
  ([sentiment, count]: [string, number]) => ({
    sentiment,
    percentage: ((count / total) * 100).toFixed(2) + "%",
  })
);

    // respond
    res.json({
      transcript: transcriptData.text,
      sentimentSummary: sentimentScores,
      sentimentDetails: transcriptData.sentiment_analysis_results,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error processing sentiment" });
  }
});

export default router;
