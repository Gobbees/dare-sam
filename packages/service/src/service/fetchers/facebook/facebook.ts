// TODO remove it once for loops will be replaced by await Promise.all
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { sendTokenizedRequest, sendPagedRequest } from '@crystal-ball/common';
import { FacebookPost, FacebookPostComment } from './types';

// increase limit in order to have bigger pages and avoid some API calls
const MAX_LIMIT = 100;

/**
 * Fetches the replies for a comment given its ID.
 *
 * **Includes Paging.**
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
    for (const reply of response.data) {
      replies.push({
        id: reply.id,
        likeCount: reply.like_count,
        message: reply.message,
        replyTo: commentId,
      });
    }
    if (response.paging && response.paging.next) {
      response = await sendPagedRequest(response.paging.next);
    } else {
      break;
    }
  }

  return replies.length ? replies : undefined;
};

/**
 * Fetches the comments from a Facebook Graph API object.
 *
 * **Includes Paging.**
 * @param comments the Graph API object (will be correctly typed)
 * @param withReplies should fetch also the comments replies
 */
const fetchComments = async (comments: any, withReplies: boolean) => {
  if (!comments) {
    return [];
  }
  let response = comments;
  const result: FacebookPostComment[] = [];
  while ((response.paging && response.paging.next) || response.data.length) {
    for (const comment of response.data) {
      const replies =
        withReplies && comment.comments
          ? await fetchRepliesForComment(comment.id, comment.comments)
          : undefined;
      result.push({
        id: comment.id,
        likeCount: comment.like_count,
        message: comment.message,
        replies,
      });
    }
    if (response.paging && response.paging.next) {
      response = await sendPagedRequest(response.paging.next);
    } else {
      break;
    }
  }

  return result;
};

/**
 * Fetches the comments for the post defined in options directly from Facebook Graph API.
 *
 * **Includes Paging.**
 * @param options the options
 * - `postId`: the post ID
 * - `token`: auth token
 * - `withReplies`: should fetch also the comments replies
 */
export const fetchFacebookCommentsForPost = async (
  postId: string,
  token: string,
  withReplies: boolean,
): Promise<FacebookPostComment[] | undefined> => {
  const response = await sendTokenizedRequest(
    `${postId}/comments?fields=id,message,comments{id,message}`,
    true,
    token,
  );
  if (!response) {
    return undefined;
  }
  return fetchComments(response, withReplies);
};

/**
 * Fetches the comments from the object already retrieved by Facebook Graph API.
 *
 * **Includes Paging.**
 * @param comments the Graph API object (will be correctly typed)
 * @param withReplies should fetch also the comments replies
 */
export const fetchFacebookComments = async (
  comments: any,
  withReplies: boolean,
) => fetchComments(comments, withReplies);

/**
 * Fetches the Facebook Posts for the input page.
 *
 * **Includes Paging.**
 * @param options
 * - `pageId`: the page id
 * - `token`: the auth token
 * - `fromDate`: fetches posts from a certain date
 * - `withComments`: should fetch also the posts comments
 * - `withCommentsReplies`: should fetch also the posts comments replies
 */
export const fetchFacebookPagePosts = async (options: {
  pageId: string;
  token: string;
  fromDate: Date;
  withComments?: boolean;
  withCommentsReplies?: boolean;
}): Promise<FacebookPost[] | undefined> => {
  let url = `${
    options.pageId
  }/posts?limit=${MAX_LIMIT}&since=${options.fromDate.toISOString()}&fields=id,message,picture,likes.summary(true)`;
  if (options.withComments) {
    url = url.concat(
      `,comments.order(reverse_chronological){id,message${
        options.withCommentsReplies
          ? ',comments.order(reverse_chronological){id,message}'
          : ''
      }}`,
    );
  }
  let response = await sendTokenizedRequest(url, true, options.token);
  const posts: FacebookPost[] = [];
  while ((response.paging && response.paging.next) || response.data.length) {
    for (const post of response.data) {
      posts.push({
        pid: post.id,
        message: post.message,
        picture: post.picture,
        likeCount: post.likes.summary.total_count,
        comments: await fetchFacebookComments(
          post.comments,
          options.withCommentsReplies || false,
        ),
      });
    }
    if (response.paging && response.paging.next) {
      response = await sendPagedRequest(response.paging.next);
    } else {
      break;
    }
  }

  return posts;
};
