interface FacebookPostComment {
  id: string;
  likeCount: number;
  message: string;
  publishedDate: Date;
  repliesCount: number;
  replies?: FacebookPostComment[];
  replyTo?: string;
}

interface FacebookPost {
  id: string;
  message?: string;
  picture?: string;
  likeCount: number;
  sharesCount: number;
  publishedDate: Date;
  commentCount: number;
  comments?: FacebookPostComment[];
}

interface FacebookPage {
  id: string;
  name: string;
  pictureUrl: string;
}

export { FacebookPage, FacebookPost, FacebookPostComment };
