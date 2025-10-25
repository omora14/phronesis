import { AIResult } from "./types";

export async function analyzeAudio(fileUri: string): Promise<AIResult> {
  // TODO: later connect to real AI service
  console.log("Analyzing audio file:", fileUri);

  // dummy result for testing
  return {
    sentiment: { positive: 0.7, neutral: 0.2, negative: 0.1 },
    emotions: { joy: 0.8, sadness: 0.1, anger: 0.05, fear: 0.03, surprise: 0.02 },
    summary: "This is a test summary of the user's mood and emotions."
  };
}
