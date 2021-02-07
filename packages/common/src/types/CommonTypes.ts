export enum Source {
  Facebook = 'FACEBOOK',
  Instagram = 'INSTAGRAM',
}

export enum Sentiment {
  Positive = 3,
  Neutral = 2,
  Mixed = 1,
  Negative = 0,
}

export interface EntitySentiment {
  entity: string;
  sentiment: Sentiment;
}
