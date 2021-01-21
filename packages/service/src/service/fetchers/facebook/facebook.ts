/* eslint-disable no-await-in-loop */
import { sendTokenizedRequest, sendPagedRequest } from '@crystal-ball/common';
import { FacebookPage, FacebookPost, FacebookPostComment } from './types';

const MAX_LIMIT = 100;

export const fetchFacebookPages = async (
  token: string,
): Promise<FacebookPage[] | undefined> => {
  const response = await sendTokenizedRequest(
    'me/accounts?fields=id,access_token,name,picture{url}',
    true,
    token,
  );
  if (!response) {
    return undefined;
  }
  const pages: FacebookPage[] = [];
  response.data.forEach((page: any) =>
    pages.push({
      pid: page.id,
      pageAccessToken: page.access_token,
      name: page.name,
      pictureUrl: page.picture.data.url,
    }),
  );

  return pages;
};

/**
 * Fetches the replies for a comment given its IDs.
 * Includes Paging.
 * @param commentId the comment id
 * @param comments the comments object in the comments return
 */
const fetchRepliesForComment = async (
  commentId: string,
  comments: any,
): Promise<FacebookPostComment[] | undefined> => {
  let response = comments;
  const replies: FacebookPostComment[] = [];
  while ((response.paging && response.paging.next) || response.data.length) {
    response.data.forEach((reply: any) =>
      replies.push({
        id: reply.id,
        likeCount: reply.like_count,
        message: reply.message,
        replyTo: commentId,
      }),
    );
    if (response.paging && response.paging.next) {
      response = await sendPagedRequest(response.paging.next);
    } else {
      break;
    }
  }

  return replies.length ? replies : undefined;
};

export const fetchFacebookCommentsForPost = async (
  postId: string,
  token: string,
  withReplies: boolean,
): Promise<FacebookPostComment[] | undefined> => {
  let response = await sendTokenizedRequest(
    `${postId}/comments?fields=id,like_count,message,comments{id,message,like_count}`,
    true,
    token,
  );
  if (!response) {
    return undefined;
  }

  const comments: FacebookPostComment[] = [];
  while ((response.paging && response.paging.next) || response.data.length) {
    response.data.forEach(async (comment: any) => {
      const replies =
        withReplies && comment.comments
          ? await fetchRepliesForComment(comment.id, comment.comments)
          : undefined;
      comments.push({
        id: comment.id,
        likeCount: comment.like_count,
        message: comment.message,
        replies,
      });
    });
    if (response.paging && response.paging.next) {
      response = await sendPagedRequest(response.paging.next);
    } else {
      break;
    }
  }

  return comments;
};

// TODO add option since(date) for fetching only posts that has been created after date

export const fetchFacebookPagePosts = async (
  pageId: string,
  token: string,
): Promise<FacebookPost[] | undefined> => {
  let response = await sendTokenizedRequest(
    `${pageId}/posts?limit=${MAX_LIMIT}&fields=id,message,picture,likes.summary(true)`,
    true,
    token,
  );
  if (!response) {
    return undefined;
  }
  const posts: FacebookPost[] = [];
  while ((response.paging && response.paging.next) || response.data.length) {
    response.data.forEach(async (post: any) =>
      posts.push({
        pid: post.id,
        message: post.message,
        picture: post.picture,
        likeCount: post.likes.summary.total_count,
        comments: await fetchFacebookCommentsForPost(post.id, token, true),
      }),
    );
    if (response.paging && response.paging.next) {
      response = await sendPagedRequest(response.paging.next);
    } else {
      break;
    }
  }
  return posts;
};
