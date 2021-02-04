import {
  AnalyzedStatus,
  FacebookComment,
  FacebookPost,
} from '@crystal-ball/database';

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
