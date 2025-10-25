import { Request, Response, Router } from "express";
import { analyzeSentiment } from "../services/aiService";

const router = Router();

/**
 * POST /sentiment
 * Body: { audioUrl?: string, videoUrl?: string }
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { audioUrl, videoUrl } = req.body;

    const sentimentResults = await analyzeSentiment({ audioUrl, videoUrl });

    return res.status(200).json({
      success: true,
      data: sentimentResults,
    });
  } catch (error: any) {
    console.error("Sentiment analysis error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error analyzing sentiment",
    });
  }
});

export default router;
