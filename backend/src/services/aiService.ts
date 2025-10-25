import axios from "axios";

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

export interface SentimentResult {
  sentiment: string;
  confidence: number;
}

export const analyzeAudio = async (audioUrl: string): Promise<SentimentResult[]> => {
  if (!ASSEMBLYAI_API_KEY) throw new Error("AssemblyAI API key not set");

  const transcriptResponse = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    {
      audio_url: audioUrl,
      sentiment_analysis: true,
    },
    {
      headers: { authorization: ASSEMBLYAI_API_KEY },
    }
  );

  const transcriptId = transcriptResponse.data.id;

  let result;
  do {
    result = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { authorization: ASSEMBLYAI_API_KEY },
    });
    await new Promise((r) => setTimeout(r, 2000));
  } while (result.data.status !== "completed");

  return result.data.sentiment_analysis_results;
};
