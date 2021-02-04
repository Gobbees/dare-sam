export enum Sentiment {
  POSITIVE = 2,
  NEUTRAL = 1,
  MIXED = 0,
  NEGATIVE = -1,
}
export interface FacebookComment {
  message?: string;
  likeCount: number;
  id: string;
  sentiment?: Sentiment;
}

export interface FacebookPost {
  publishedDate: Date;
  message?: string;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  id: string;
  postSentiment?: Sentiment;
  // average of comments sentiment from -1 to 1
  overallSentiment?: number;
}

export interface FacebookPage {
  id: string;
  name: string;
  picture: string;
}

export interface User {
  name?: string;
  email?: string;
  image?: string;
  facebookPage?: FacebookPage;
}
