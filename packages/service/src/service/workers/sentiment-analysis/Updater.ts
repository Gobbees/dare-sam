/* eslint-disable no-restricted-syntax */
import { Comment, Post, SocialProfile } from '@crystal-ball/database';
import {
  fetchPostsByProfileAndPublishedDate,
  fetchUnanalyzedCommentsByPost,
  fetchUnanalyzedPostsByProfileAndPublishedDate,
  fetchUnanalyzedRepliesByPost,
} from '../../fetchers/db';
import recomputePostsOverallSentiment from './OverallSentimentAnalysis';
import submitToSentimentAnalysisService, {
  SentimentAnalysisServiceRequest,
} from './SentimentAnalysisSubmitter';

// TODO add extra logging here

const updateSentiments = async (page: SocialProfile, fetchPageSince: Date) => {
  // TODO find a better way to do this
  // posts
  const unanalyzedPosts = await fetchUnanalyzedPostsByProfileAndPublishedDate(
    page,
    fetchPageSince,
  );
  let sentimentAnalysisServiceInput: SentimentAnalysisServiceRequest = {
    sentences: unanalyzedPosts.map((post) => ({
      id: post.id,
      message: post.message!, // unanalyzed posts have a message by definition
    })),
    languageCode: 'it', // TODO change this to be a user setting
  };
  let sentimentAnalysisResult = await submitToSentimentAnalysisService(
    sentimentAnalysisServiceInput,
  );
  for (const post of sentimentAnalysisResult) {
    await Post.update(post.id, {
      sentiment: post.sentiment,
    });
  }

  // comments + replies

  // list of posts that have some comments that changed, and so that needs to have their
  // overall sentiment updated
  const postsToBeRecomputed: Post[] = [];

  const unanalyzedComments: Array<Comment> = [];
  const pagePosts = await fetchPostsByProfileAndPublishedDate(
    page,
    fetchPageSince,
  );

  for (const post of pagePosts) {
    const unanalyzedCommentsForPost = await fetchUnanalyzedCommentsByPost(post);
    if (unanalyzedCommentsForPost.length) {
      postsToBeRecomputed.push(post);
    }
    unanalyzedComments.push(...unanalyzedCommentsForPost);
    const unanalyzedRepliesForPost = await fetchUnanalyzedRepliesByPost(post);
    unanalyzedComments.push(...unanalyzedRepliesForPost);
  }
  sentimentAnalysisServiceInput = {
    sentences: unanalyzedComments.map((comment) => ({
      id: comment.id,
      message: comment.message,
    })),
    languageCode: 'it', // TODO change this to be a user setting
  };
  sentimentAnalysisResult = await submitToSentimentAnalysisService(
    sentimentAnalysisServiceInput,
  );
  for (const comment of sentimentAnalysisResult) {
    await Comment.update(comment.id, {
      sentiment: comment.sentiment,
    });
  }
  if (postsToBeRecomputed.length) {
    await recomputePostsOverallSentiment(
      postsToBeRecomputed,
      async (post: Post) => {
        const comments = await Comment.findCommentsByPost(post.id, {
          analyzedOnly: true,
        });
        return comments.map((comment) => comment.sentiment!); // analyzed only
      },
      async (post: Post, overallSentiment: number) => {
        await Post.update(post.id, {
          commentsOverallSentiment: overallSentiment,
        });
      },
    );
  }
};

export default updateSentiments;
