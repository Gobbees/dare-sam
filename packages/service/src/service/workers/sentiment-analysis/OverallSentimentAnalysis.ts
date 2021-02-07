/* eslint-disable no-restricted-syntax */
import { Sentiment } from '@crystal-ball/common';
import { Post } from '@crystal-ball/database';

const recomputePostsOverallSentiment = async (
  posts: Post[],
  fetcher: (post: Post) => Promise<Array<Sentiment>>,
  updater: (post: Post, overallSentiment: number) => Promise<void>,
) => {
  for (const post of posts) {
    const sentiments = await fetcher(post);
    if (sentiments.length) {
      const overallSentimnet = computeSentiment(sentiments);
      await updater(post, overallSentimnet);
    }
  }
};

const computeSentiment = (sentiments: Array<Sentiment>): number => {
  let sentimentSum = 0;
  sentiments.forEach((sentiment) => {
    if (sentiment === Sentiment.Positive) {
      sentimentSum += 1;
    } else if (sentiment === Sentiment.Negative) {
      sentimentSum -= 1;
    }
  });

  return sentimentSum / sentiments.length;
};

export default recomputePostsOverallSentiment;
