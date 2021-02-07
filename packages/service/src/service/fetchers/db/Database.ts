import { Comment, Post, SocialProfile, User } from '@crystal-ball/database';

export const fetchAllUsers = async () => {
  const users = await User.findAllUsersWithProfiles();
  return users;
};

export const fetchPostsByProfileAndPublishedDate = async (
  profile: SocialProfile,
  publishedDate: Date,
) => Post.findPostsBySocialProfileAndPublishedDate(profile, publishedDate);

export const fetchUnanalyzedPostsByProfileAndPublishedDate = async (
  profile: SocialProfile,
  publishedDate: Date,
) =>
  Post.findPostsBySocialProfileAndPublishedDate(profile, publishedDate, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });

export const fetchUnanalyzedCommentsByPost = async (post: Post) =>
  Comment.findCommentsByPost(post.id, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });

export const fetchUnanalyzedRepliesByPost = async (post: Post) =>
  Comment.findRepliesByPost(post.id, {
    unanalyzedOnly: true,
    nonEmpty: true,
  });
