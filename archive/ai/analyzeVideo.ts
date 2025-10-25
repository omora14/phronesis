import { analyzeAudio } from "./analyzeAudio";
import { AIResult } from "./types";

export async function analyzeVideo(videoUri: string): Promise<AIResult> {
  console.log("Analyzing video file:", videoUri);

  // TODO: extract audio from video if needed
  const audioUri = videoUri.replace(".mp4", ".wav");

  return analyzeAudio(audioUri);
}
