interface InstagramPostComment {
  id: string;
  likeCount: number;
  message: string;
  publishedDate: Date;
  repliesCount?: number;
  replies?: InstagramPostComment[];
  replyTo?: string;
}

interface InstagramPost {
  id: string;
  message?: string;
  picture?: string;
  likeCount: number;
  publishedDate: Date;
  commentCount: number;
  comments?: InstagramPostComment[];
}

interface InstagramProfile {
  id: string;
  name: string;
  picture: string;
}

export { InstagramProfile, InstagramPost, InstagramPostComment };
