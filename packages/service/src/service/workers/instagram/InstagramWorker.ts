/* eslint-disable no-restricted-syntax */
import {
  InstagramComment,
  InstagramProfile,
  InstagramPost,
  User,
} from '@crystal-ball/database';
import {
  fetchPostsByProfileAndPublishedDate,
  fetchUnanalyzedComments,
  fetchUnanalyzedPostsByProfileAndPublishedDate,
  fetchUnanalyzedReplies,
} from '../../fetchers/instagram/db';
import fetchInstagramProfilePosts from '../../fetchers/instagram/graph';
import {
  recomputePostsOverallSentiment,
  SentimentAnalysisServiceRequest,
  submitToSentimentAnalysisService,
} from '../sentiment-analysis';

const fetchInstagramData = async (
  user: User,
  options: { fetchSinceDays: number },
) => {
  // fetch interval
  const fetchPageSince = new Date(
    new Date().getTime() - 1000 * 60 * 60 * 24 * options.fetchSinceDays,
  );

  const profile = user.instagramProfile;
  if (!profile) {
    return;
  }

  console.log(`Fetching Instagram profile: ${profile.name}`);

  const posts = await fetchInstagramProfilePosts({
    pageId: profile.id,
    token: user.facebookAccessToken,
    fromDate: fetchPageSince,
    withComments: true,
    withCommentsReplies: true,
  });
  // TODO wrap every function call in a manageCall
  // that handles all the GraphErrors and reacts accordingly
  if (!posts) {
    return;
  }

  // updates posts
  for (const post of posts) {
    let postInDB = await InstagramPost.findOne(post.id);
    if (postInDB) {
      const shouldRecomputeSentiment = postInDB.message !== post.message;
      await InstagramPost.update(postInDB.id, {
        likeCount: post.likeCount,
        commentsCount: post.commentCount,
        publishedDate: post.publishedDate,
        message: post.message,
        postSentiment: shouldRecomputeSentiment
          ? undefined
          : postInDB.postSentiment,
        pictureUrl: post.picture,
      });
    } else {
      const response = await InstagramPost.insert({
        id: post.id,
        publishedDate: post.publishedDate,
        message: post.message,
        pictureUrl: post.picture,
        commentsCount: post.commentCount,
        likeCount: post.likeCount,
        profile,
      });
      console.log(
        `Added Instagram post ${post.id} with id ${JSON.stringify(
          response.identifiers[0].id,
        )}`,
      );
      postInDB = await InstagramPost.findOne(post.id);
    }

    if (post.comments) {
      // updates post comments
      for (const comment of post.comments) {
        let commentInDB = await InstagramComment.findOne(comment.id);
        if (commentInDB) {
          await InstagramComment.update(commentInDB.id, {
            likeCount: comment.likeCount,
            repliesCount: comment.repliesCount,
          });
        } else {
          const response = await InstagramComment.insert({
            id: comment.id,
            message: comment.message,
            publishedDate: comment.publishedDate,
            repliesCount: comment.repliesCount,
            likeCount: comment.likeCount,
            post: postInDB,
          });
          console.log(
            `Added Instagram comment ${comment.id} with id ${JSON.stringify(
              response.identifiers[0].id,
            )}`,
          );
          commentInDB = await InstagramComment.findOne(comment.id);
        }

        if (comment.replies) {
          // updates comment replies
          for (const reply of comment.replies) {
            const replyInDB = await InstagramComment.findOne(reply.id);
            if (replyInDB) {
              await InstagramComment.update(replyInDB.id, {
                likeCount: reply.likeCount,
                message: reply.message,
              });
            } else {
              const response = await InstagramComment.insert({
                id: reply.id,
                message: reply.message,
                publishedDate: reply.publishedDate,
                likeCount: reply.likeCount,
                replyTo: commentInDB,
                post: postInDB,
              });
              console.log(
                `Added Instagram reply ${comment.id} with id ${JSON.stringify(
                  response.identifiers[0].id,
                )}`,
              );
            }
          }
        }
      }
    }
  }
  await updateSentiments(profile, fetchPageSince);
};

const updateSentiments = async (
  profile: InstagramProfile,
  fetchPageSince: Date,
) => {
  // TODO find a better way to do this
  // posts
  const unanalyzedPosts = await fetchUnanalyzedPostsByProfileAndPublishedDate(
    profile,
    fetchPageSince,
  );
  let sentimentAnalysisServiceInput: SentimentAnalysisServiceRequest = {
    sentences: unanalyzedPosts.map((post) => ({
      id: post.id,
      message: post.message,
    })),
    languageCode: 'it', // TODO change this to be a user setting
  };
  let sentimentAnalysisResult = await submitToSentimentAnalysisService(
    sentimentAnalysisServiceInput,
  );
  for (const post of sentimentAnalysisResult) {
    await InstagramPost.update(post.id, {
      postSentiment: post.sentiment,
    });
  }
  // comments + replies
  // list of posts that have some comments that changed, and so that needs to have their
  // overall sentiment updated
  const postsToBeRecomputed: string[] = [];
  const unanalyzedComments: Array<InstagramComment> = [];
  const pagePosts = await fetchPostsByProfileAndPublishedDate(
    profile,
    fetchPageSince,
  );
  for (const post of pagePosts) {
    const unanalyzedCommentsForPost = await fetchUnanalyzedComments(post);
    if (unanalyzedCommentsForPost.length) {
      postsToBeRecomputed.push(post.id);
    }
    unanalyzedComments.push(...unanalyzedCommentsForPost);
    const unanalyzedRepliesForPost = await fetchUnanalyzedReplies(post);
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
    await InstagramComment.update(comment.id, {
      overallSentiment: comment.sentiment,
    });
  }
  if (postsToBeRecomputed.length) {
    await recomputePostsOverallSentiment(
      postsToBeRecomputed,
      async (postId: string) => {
        const comments = await InstagramComment.findCommentsByPost(postId);
        return comments.map((comment) => comment.overallSentiment);
      },
      async (postId: string, overallSentiment: number) => {
        await InstagramPost.update(postId, {
          commentsOverallSentiment: overallSentiment,
        });
      },
    );
  }
};
// TODO add extra logging here

export default fetchInstagramData;
