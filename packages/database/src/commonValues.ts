export enum AnalyzedStatus {
  ANALYZED = 1,
  UNANALYZED = 0,
}

export enum Sentiment {
  POSITIVE = 2,
  NEUTRAL = 1,
  MIXED = 0,
  NEGATIVE = -1,
}

export interface EntitySentiment {
  entity: string;
  sentiment: Sentiment;
}
