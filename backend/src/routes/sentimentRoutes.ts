import axios from "axios";
import express, { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { saveSentimentData } from "../services/analysisService";
 
const router = express.Router();
 
// Multer setup
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `recorded-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });
 
// POST /api/sentiment
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const uid = req.body.uid || "hackathon-user";
 
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
 
    const fileStream = fs.createReadStream(file.path);
 
    // Upload to AssemblyAI
    const uploadResp = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      fileStream,
      {
        headers: {
          authorization: process.env.ASSEMBLY_API_KEY!,
          "transfer-encoding": "chunked",
        },
      }
    );
 
    const uploadUrl = uploadResp.data.upload_url;
 
    // transcription + sentiment analysis
    const transcriptResp = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: uploadUrl, sentiment_analysis: true },
      {
        headers: {
          authorization: process.env.ASSEMBLY_API_KEY!,
          "content-type": "application/json",
        },
      }
    );
 
    const transcriptId = transcriptResp.data.id;
 
    // Poll until transcription completes
    let transcriptData: any;
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
 
    // compute weighted sentiment summary
    type SentimentItem = {
      sentiment: string;
      confidence: number;
      text: string;
    };
 
    const sentimentDetails: SentimentItem[] =
      transcriptData.sentiment_analysis_results || [];
 
    const weightedScores: Record<string, number> = {};
    let totalWeight = 0;
 
    sentimentDetails.forEach(({ sentiment, confidence, text }: SentimentItem) => {
      // weight by confidence × text length (in characters)
      const weight = confidence * text.length;
      weightedScores[sentiment] = (weightedScores[sentiment] || 0) + weight;
      totalWeight += weight;
    });
 
    const sentimentSummary = Object.entries(weightedScores).map(
      ([sentiment, score]) => ({
        sentiment,
        percentage: ((score / totalWeight) * 100).toFixed(2) + "%",
      })
    );
 
    // compute overall sentiment score (numeric)
    // POSITIVE = +1, NEUTRAL = 0, NEGATIVE = -1, weighted average
    console.log("📊 Sentiment summary before calculation:", sentimentSummary);
    
    const sentimentScore =
      sentimentSummary.reduce((sum, item) => {
        const weight =
          item.sentiment === "POSITIVE"
            ? 1
            : item.sentiment === "NEGATIVE"
            ? -1
            : 0;
        const percentage = parseFloat(item.percentage);
        console.log(`  - ${item.sentiment}: weight=${weight}, percentage=${percentage}, contribution=${weight * percentage}`);
        return sum + weight * percentage;
      }, 0) / 100;
    
    console.log("🎯 Calculated sentiment score:", sentimentScore);

    // Determine dominant emotion based on highest weighted score
    const dominantSentiment = Object.entries(weightedScores).reduce(
      (max, [sentiment, score]) => score > max.score ? { sentiment, score } : max,
      { sentiment: "NEUTRAL", score: 0 }
    ).sentiment;

    // Map sentiment to user-friendly emotion labels
    const emotionMap: Record<string, string> = {
      POSITIVE: "Happy",
      NEGATIVE: "Sad",
      NEUTRAL: "Calm"
    };
    const emotion = emotionMap[dominantSentiment] || "Neutral";

    // (text + numeric score)
    await saveSentimentData(uid, transcriptData.text, sentimentScore);

    fs.unlinkSync(file.path);

    res.json({
      transcript: transcriptData.text,
      sentimentSummary,
      sentimentScore,
      emotion,
      sentimentDetails,
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Error processing sentiment" });
  }
});
 
export default router;