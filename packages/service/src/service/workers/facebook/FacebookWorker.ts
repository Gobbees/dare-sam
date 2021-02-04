/* eslint-disable no-restricted-syntax */
import {
  AnalyzedStatus,
  FacebookComment,
  FacebookPage,
  FacebookPost,
  User,
} from '@crystal-ball/database';
import {
  fetchPostsByPageAndPublishedDate,
  fetchUnanalyzedComments,
  fetchUnanalyzedPostsByPageAndPublishedDate,
  fetchUnanalyzedReplies,
} from '../../fetchers/facebook/db';
import { fetchFacebookPagePosts } from '../../fetchers/facebook/graph';
import submitToSentimentAnalysisService, {
  SentimentAnalysisServiceRequest,
} from '../sentiment-analysis';

const fetchFacebookData = async (
  user: User,
  options: { fetchSinceDays: number },
) => {
  // fetch interval
  const fetchPageSince = new Date(
    new Date().getTime() - 1000 * 60 * 60 * 24 * options.fetchSinceDays,
  );

  const page = user.facebookPage;
  if (!page) {
    return;
  }

  console.log(`Fetching page: ${page.name}`);

  const posts = await fetchFacebookPagePosts({
    pageId: page.id,
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
    let postInDB = await FacebookPost.findOne(post.id);
    if (postInDB) {
      const shouldRecomputeSentiment = postInDB.message !== post.message;
      await FacebookPost.update(postInDB.id, {
        likeCount: post.likeCount,
        commentsCount: post.commentCount,
        sharesCount: post.sharesCount,
        publishedDate: post.publishedDate,
        message: post.message,
        analyzedStatus: shouldRecomputeSentiment
          ? AnalyzedStatus.UNANALYZED
          : AnalyzedStatus.ANALYZED,
        postSentiment: shouldRecomputeSentiment
          ? undefined
          : postInDB.postSentiment,
        pictureUrl: post.picture,
      });
    } else {
      const response = await FacebookPost.insert({
        id: post.id,
        publishedDate: post.publishedDate,
        message: post.message,
        pictureUrl: post.picture,
        commentsCount: post.commentCount,
        sharesCount: post.sharesCount,
        likeCount: post.likeCount,
        page,
      });
      console.log(
        `Added post ${post.id} with id ${JSON.stringify(
          response.identifiers[0].id,
        )}`,
      );
      postInDB = await FacebookPost.findOne(post.id);
    }

    if (post.comments) {
      // updates post comments
      for (const comment of post.comments) {
        let commentInDB = await FacebookComment.findOne(comment.id);
        if (commentInDB) {
          const shouldRecomputeSentiment =
            commentInDB.message !== comment.message;
          await FacebookComment.update(commentInDB.id, {
            likeCount: comment.likeCount,
            message: comment.message,
            repliesCount: comment.repliesCount,
            analyzedStatus: shouldRecomputeSentiment
              ? AnalyzedStatus.UNANALYZED
              : AnalyzedStatus.ANALYZED,
            overallSentiment: shouldRecomputeSentiment
              ? undefined
              : commentInDB.overallSentiment,
            entitiesSentiment: shouldRecomputeSentiment
              ? undefined
              : commentInDB.entitiesSentiment,
          });
        } else if (comment.message) {
          const response = await FacebookComment.insert({
            id: comment.id,
            message: comment.message,
            publishedDate: comment.publishedDate,
            repliesCount: comment.repliesCount,
            likeCount: comment.likeCount,
            post: postInDB,
          });
          console.log(
            `Added comment ${comment.id} with id ${JSON.stringify(
              response.identifiers[0].id,
            )}`,
          );
          commentInDB = await FacebookComment.findOne(comment.id);
        } else {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (comment.replies) {
          // updates comment replies
          for (const reply of comment.replies) {
            const replyInDB = await FacebookComment.findOne(reply.id);
            if (replyInDB) {
              const shouldRecomputeSentiment =
                replyInDB.message !== reply.message;
              await FacebookComment.update(replyInDB.id, {
                likeCount: reply.likeCount,
                message: reply.message,
                analyzedStatus: shouldRecomputeSentiment
                  ? AnalyzedStatus.UNANALYZED
                  : AnalyzedStatus.ANALYZED,
                overallSentiment: shouldRecomputeSentiment
                  ? undefined
                  : replyInDB.overallSentiment,
                entitiesSentiment: shouldRecomputeSentiment
                  ? undefined
                  : replyInDB.entitiesSentiment,
              });
            } else if (reply.message) {
              const response = await FacebookComment.insert({
                id: reply.id,
                message: reply.message,
                publishedDate: reply.publishedDate,
                likeCount: reply.likeCount,
                replyTo: commentInDB,
                post: postInDB,
              });
              console.log(
                `Added reply ${comment.id} with id ${JSON.stringify(
                  response.identifiers[0].id,
                )}`,
              );
            }
          }
        }
      }
    }
  }
  await fetchUnanalyzedAndSubmitToSA(page, fetchPageSince);
};

const fetchUnanalyzedAndSubmitToSA = async (
  page: FacebookPage,
  fetchPageSince: Date,
) => {
  // TODO find a better way to do this
  // posts
  const unanalyzedPosts = await fetchUnanalyzedPostsByPageAndPublishedDate(
    page,
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
  for (const comment of sentimentAnalysisResult) {
    await FacebookPost.update(comment.id, {
      analyzedStatus: AnalyzedStatus.ANALYZED,
      postSentiment: comment.sentiment,
    });
  }

  // comments + replies
  const unanalyzedComments: Array<FacebookComment> = [];
  const pagePosts = await fetchPostsByPageAndPublishedDate(
    page,
    fetchPageSince,
  );

  for (const post of pagePosts) {
    const unanalyzedCommentsForPost = await fetchUnanalyzedComments(post);
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
    await FacebookComment.update(comment.id, {
      analyzedStatus: AnalyzedStatus.ANALYZED,
      overallSentiment: comment.sentiment,
    });
  }
};

export default fetchFacebookData;
