interface FacebookPostComment {
  // TODO
  id: string;
  likeCount?: number;
  message: string;
  replies?: FacebookPostComment[];
  replyTo?: string;
}

interface FacebookPost {
  // TODO
  id: string;
  message?: string;
  picture?: string;
  likeCount: number;
  // posts?fields=comments.since(2012-01-01T10:10:10),message
  comments?: FacebookPostComment[];
}

/**
 * Response of the /{page-id}/posts API.
 */
interface FacebookPostsResponse {
  // TODO
}
interface FacebookPage {
  pid: string;
  pageAccessToken: string;
  name: string;
  pictureUrl: string;
}

export {
  FacebookPage,
  FacebookPostsResponse,
  FacebookPost,
  FacebookPostComment,
};
