// ── Core analysis payload returned by the backend ────────────────────────────

export interface AnalysisResult {
  // Content identity
  contentType: string;
  detectedPlatform: string;

  // Scoring
  engagementScore: number;
  estimatedReach: string;
  viralityPotential: string;

  // Quality dimensions
  tone: string;
  sentiment: string;
  readability: string;
  hookStrength: string;
  cta: string;
  grammar: string;
  professionalism: string;

  // Stats
  hashtags: number;
  emojiUsage: string;
  wordCount: number;
  estimatedReadingTime: string;
  keywordDensity: string;

  // Recommendations
  suggestions: string[];

  // Generated content
  improvedPost: string;
  caption: string;
  callToAction: string;
  recommendedHashtags: string[];
  reelScript: string;

  // Planner
  postingSchedule: string[];
  contentIdeas: string[];
}

export interface AnalysisResponse {
  analysis: AnalysisResult;
  ocrFailed?: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
}

export type DocType = 'privacy' | 'terms' | 'support';
