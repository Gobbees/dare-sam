/* eslint-disable no-restricted-syntax */
import {
  AnalyzedStatus,
  FacebookComment,
  FacebookPage,
  FacebookPost,
  Sentiment,
  User,
} from '@crystal-ball/database';
import {
  fetchFacebookPagesForUser,
  fetchUnanalyzedComments,
} from '../../fetchers/facebook/db';
import { fetchFacebookPagePosts } from '../../fetchers/facebook/graph';
import submitToSentimentAnalysisService, {
  SentimentAnalysisServiceRequest,
} from '../sentiment-analysis';

const fetchUnanalyzedAndSubmitToSA = async (page: FacebookPage) => {
  //   const unanalyzedPosts = fetchUnanalyzedPosts(pageId);
  const unanalyzedComments: Array<FacebookComment> = [];
  const pagePosts = await FacebookPost.find({
    where: { page },
  });

  for (const post of pagePosts) {
    const unanalyzedCommentsForPost = await fetchUnanalyzedComments(post);
    unanalyzedComments.push(...unanalyzedCommentsForPost);
  }
  const sentimentAnalysisServiceInput: SentimentAnalysisServiceRequest = {
    sentences: unanalyzedComments.map((comment) => ({
      id: comment.id,
      message: comment.message,
    })),
    languageCode: 'it',
  };
  const sentimentAnalysisResult = await submitToSentimentAnalysisService(
    sentimentAnalysisServiceInput,
  );

  for (const comment of sentimentAnalysisResult) {
    await FacebookComment.update(comment.id, {
      analyzedStatus: AnalyzedStatus.ANALYZED,
      overallSentiment: comment.sentiment || Sentiment.MIXED,
    });
  }
};

const fetchFacebookData = async (
  user: User,
  options: { fetchSinceDays: number },
) => {
  // fetch interval
  const fetchPagesSince = new Date(
    new Date().getTime() - 1000 * 60 * 60 * 24 * options.fetchSinceDays,
  );

  const pages = await fetchFacebookPagesForUser(user.id);
  for (const page of pages) {
    console.log(`Fetching page: ${page.name}`);

    const posts = await fetchFacebookPagePosts({
      pageId: page.id,
      token: user.facebookAccessToken,
      fromDate: fetchPagesSince,
      withComments: true,
      withCommentsReplies: true,
    });
    // TODO wrap every function call in a manageCall
    // that handles all the GraphErrors and reacts accordingly
    if (!posts) {
      break;
    }

    // updates posts
    for (const post of posts) {
      let postInDB = await FacebookPost.findOne(post.id);
      if (postInDB) {
        const shouldRecomputeSentiment = postInDB.message !== post.message;
        await FacebookPost.update(postInDB, {
          likeCount: post.likeCount,
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
          pictureUrl: post.picture,
          message: post.message,
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
            await FacebookComment.update(commentInDB, {
              // TODO add like count
              message: comment.message,
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
          } else {
            const response = await FacebookComment.insert({
              id: comment.id,
              message: comment.message,
              post: postInDB,
            });
            console.log(
              `Added comment ${comment.id} with id ${JSON.stringify(
                response.identifiers[0].id,
              )}`,
            );
            commentInDB = await FacebookComment.findOne(comment.id);
          }

          if (comment.replies) {
            // updates comment replies
            for (const reply of comment.replies) {
              const replyInDB = await FacebookComment.findOne(reply.id);
              if (replyInDB) {
                const shouldRecomputeSentiment =
                  replyInDB.message !== reply.message;
                await FacebookComment.update(replyInDB, {
                  // TODO add like count
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
              } else {
                const response = await FacebookComment.insert({
                  id: reply.id,
                  message: reply.message,
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
    await fetchUnanalyzedAndSubmitToSA(page);
  }
};

export default fetchFacebookData;
