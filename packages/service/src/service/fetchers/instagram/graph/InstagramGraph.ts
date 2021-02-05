// TODO remove it once for loops will be replaced by await Promise.all
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { sendTokenizedRequest, sendPagedRequest } from '@crystal-ball/common';
import { InstagramPost, InstagramPostComment } from '../types';

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
): Promise<InstagramPostComment[] | undefined> => {
  let response = comments;
  const replies: InstagramPostComment[] = [];
  while ((response.paging && response.paging.next) || response.data.length) {
    for (const reply of response.data) {
      replies.push({
        id: reply.id,
        likeCount: reply.like_count,
        message: reply.text,
        publishedDate: reply.created_time,
        repliesCount: 0, // a reply cannot have replies
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
 * Fetches the comments from a Instagram Graph API object.
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
  const result: InstagramPostComment[] = [];
  while ((response.paging && response.paging.next) || response.data.length) {
    for (const comment of response.data) {
      const replies =
        withReplies && comment.replies
          ? await fetchRepliesForComment(comment.id, comment.replies)
          : undefined;
      result.push({
        id: comment.id,
        likeCount: comment.like_count,
        message: comment.text,
        publishedDate: comment.timestamp,
        repliesCount: replies?.length || 0,
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
 * Fetches the comments from the object already retrieved by Instagram Graph API.
 *
 * **Includes Paging.**
 * @param comments the Graph API object (will be correctly typed)
 * @param withReplies should fetch also the comments replies
 */
const fetchInstagramComments = async (comments: any, withReplies: boolean) =>
  fetchComments(comments, withReplies);

/**
 * Fetches the Facebook Posts for the input page.
 *
 * IMPORTANT: Instagram does not allow fetching posts since a certain date, so the function
 * always fetches every post and then returns only the posts that have a timestamp
 * greater than `options.fromDate`
 *
 * **Includes Paging.**
 * @param options
 * - `pageId`: the page id
 * - `token`: the auth token
 * - `fromDate`: returns posts from a certain date
 * - `withComments`: should fetch also the posts comments
 * - `withCommentsReplies`: should fetch also the posts comments replies
 */
const fetchInstagramProfilePosts = async (options: {
  pageId: string;
  token: string;
  fromDate: Date;
  withComments?: boolean;
  withCommentsReplies?: boolean;
}): Promise<InstagramPost[] | undefined> => {
  let url = `${options.pageId}/media?limit=${MAX_LIMIT}&fields=id,caption,timestamp,media_url,like_count`;
  if (options.withComments) {
    url = url.concat(
      `,comments.limit(${MAX_LIMIT}){id,text,timestamp,like_count${
        options.withCommentsReplies
          ? `,replies.limit(${MAX_LIMIT}){id,text,timestamp,like_count}`
          : ''
      }}`,
    );
  }
  console.log(url);
  let response = await sendTokenizedRequest(url, true, options.token);
  const posts: InstagramPost[] = [];

  // flag that tells if we fetched all the posts that have been published after options.fromDate
  let reachedEndOfUsefulPosts = false;
  while ((response.paging && response.paging.next) || response.data.length) {
    for (const post of response.data) {
      if (new Date(post.timestamp) > options.fromDate) {
        const comments = await fetchInstagramComments(
          post.comments,
          options.withCommentsReplies || false,
        );
        posts.push({
          id: post.id,
          publishedDate: post.timestamp,
          message: post.caption,
          picture: post.media_url,
          likeCount: post.like_count,
          commentCount: comments.length,
          comments,
        });
      } else {
        reachedEndOfUsefulPosts = true;
        break;
      }
    }
    if (response.paging && response.paging.next && !reachedEndOfUsefulPosts) {
      response = await sendPagedRequest(response.paging.next);
    } else {
      break;
    }
  }

  return posts;
};

export default fetchInstagramProfilePosts;
