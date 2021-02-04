interface FacebookPostComment {
  id: string;
  likeCount: number;
  message: string;
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
  pageAccessToken: string;
  name: string;
  pictureUrl: string;
}

export { FacebookPage, FacebookPost, FacebookPostComment };
