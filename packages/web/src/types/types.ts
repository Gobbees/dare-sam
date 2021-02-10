import { Sentiment, Source } from '@crystal-ball/common';

export interface Comment {
  id: string;
  source: Source;
  message?: string;
  publishedDate: Date;
  permalink?: string;
  likeCount: number;
  repliesCount: number;
  sentiment?: Sentiment;
}
export interface Post {
  id: string;
  source: Source;
  message?: string;
  publishedDate: Date;
  permalink: string;
  likeCount: number;
  shareCount?: number;
  commentCount: number;
  sentiment?: Sentiment;
  commentsOverallSentiment?: number;
}
export interface SocialProfile {
  id: string;
  source: Source;
  name: string;
  picture: string;
}

export interface User {
  name?: string;
  email?: string;
  image?: string;
  facebookPage?: SocialProfile;
  instagramProfile?: SocialProfile;
}
