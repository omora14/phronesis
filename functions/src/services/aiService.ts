import axios from "axios";

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

export interface SentimentResult {
  sentiment: string;
  confidence: number;
}

export interface AnalyzeParams {
  audioUrl?: string;
  videoUrl?: string;
}


async function convertVideoToAudio(videoUrl: string): Promise<string> {
  // TODO: implement video -> audio conversion
  return videoUrl; // for now, just return the video URL as dummy
}


export async function analyzeSentiment(params: AnalyzeParams): Promise<SentimentResult[]> {
  let audioToAnalyze = params.audioUrl;

  if (!audioToAnalyze && params.videoUrl) {
    audioToAnalyze = await convertVideoToAudio(params.videoUrl);
  }

  if (!audioToAnalyze) throw new Error("No audio or video provided for sentiment analysis");

  if (!ASSEMBLYAI_API_KEY) throw new Error("AssemblyAI API key not set");

  // Send to AssemblyAI for transcription + sentiment
  const transcriptResponse = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    {
      audio_url: audioToAnalyze,
      sentiment_analysis: true,
    },
    {
      headers: { authorization: ASSEMBLYAI_API_KEY },
    }
  );

  const transcriptId = transcriptResponse.data.id;

  // oll until transcription is complete
  let result;
  do {
    result = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { authorization: ASSEMBLYAI_API_KEY },
    });

    await new Promise((r) => setTimeout(r, 2000));
  } while (result.data.status !== "completed");

  return result.data.sentiment_analysis_results as SentimentResult[];
}
