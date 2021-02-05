import {
  InstagramComment,
  InstagramPost,
  InstagramProfile,
} from '@crystal-ball/database';

export const fetchUnanalyzedPostsByProfileAndPublishedDate = async (
  profile: InstagramProfile,
  publishedDate: Date,
) =>
  InstagramPost.findPostsByProfileAndPublishedDate(profile, publishedDate, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });

export const fetchPostsByProfileAndPublishedDate = async (
  profile: InstagramProfile,
  publishedDate: Date,
) => InstagramPost.findPostsByProfileAndPublishedDate(profile, publishedDate);

export const fetchUnanalyzedComments = async (post: InstagramPost) =>
  InstagramComment.findCommentsByPost(post.id, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });

export const fetchUnanalyzedReplies = async (post: InstagramPost) =>
  InstagramComment.findRepliesByPost(post.id, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });
