import { Sentiment } from '@crystal-ball/common';

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
  commentsSentiment?: number;
}

export interface InstagramPost {
  publishedDate: Date;
  message?: string;
  likesCount: number;
  commentsCount: number;
  id: string;
  postSentiment?: Sentiment;
  commentsSentiment?: number;
}

export interface InstagramProfile {
  id: string;
  name: string;
  picture: string;
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
  instagramProfile?: InstagramProfile;
}

export enum Social {
  Facebook = 'FACEBOOK',
  Instagram = 'INSTAGRAM',
}
