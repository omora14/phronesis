import axios from "axios";
import express, { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { saveSentimentData } from "../services/analysisService"; // your Firebase service

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
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

    // Read uploaded file
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

    // Start transcription + sentiment
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

    // Compute sentiment summary
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

    // Save to Firebase
    await saveSentimentData(uid, transcriptData.text, total);

    // Delete the uploaded file (optional)
    fs.unlinkSync(file.path);

    // Respond with sentiment + transcript
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
