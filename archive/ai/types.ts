export interface SentimentScore {
  positive: number;
  neutral: number;
  negative: number;
}

export interface EmotionScores {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
}

export interface AIResult {
  sentiment: SentimentScore;
  emotions: EmotionScores;
  summary?: string; 
}
