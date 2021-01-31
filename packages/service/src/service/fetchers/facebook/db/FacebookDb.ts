import {
  AnalyzedStatus,
  FacebookComment,
  FacebookPage,
  FacebookPost,
} from '@crystal-ball/database';

export const fetchFacebookPagesForUser = async (userId: string) => {
  const pages = await FacebookPage.find({
    where: { pageOwner: userId },
  });
  return pages;
};

export const fetchUnanalyzedPosts = async (pageId: string) => {
  const posts = await FacebookPost.find({
    where: {
      page: { pageId },
      analyzedStatus: AnalyzedStatus.UNANALYZED,
    },
  });
  return posts;
};

export const fetchUnanalyzedComments = async (post: FacebookPost) => {
  const comments = await FacebookComment.findUnanalyzedByPost(post);
  return comments;
};
