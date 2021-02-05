import {
  FacebookComment,
  FacebookPage,
  FacebookPost,
} from '@crystal-ball/database';

export const fetchUnanalyzedPostsByPageAndPublishedDate = async (
  page: FacebookPage,
  publishedDate: Date,
) =>
  FacebookPost.findPostsByPageAndPublishedDate(page, publishedDate, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });

export const fetchPostsByPageAndPublishedDate = async (
  page: FacebookPage,
  publishedDate: Date,
) => FacebookPost.findPostsByPageAndPublishedDate(page, publishedDate);

export const fetchUnanalyzedComments = async (post: FacebookPost) =>
  FacebookComment.findCommentsByPost(post.id, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });

export const fetchUnanalyzedReplies = async (post: FacebookPost) =>
  FacebookComment.findRepliesByPost(post.id, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });
