/* eslint-disable no-restricted-syntax */
import { Sentiment } from '@crystal-ball/database';

const recomputePostsOverallSentiment = async (
  postIds: string[],
  fetcher: (postId: string) => Promise<Array<Sentiment>>,
  updater: (postId: string, overallSentiment: number) => Promise<void>,
) => {
  for (const postId of postIds) {
    const sentiments = await fetcher(postId);
    if (sentiments.length) {
      const overallSentimnet = computeSentiment(sentiments);
      await updater(postId, overallSentimnet);
    }
  }
};

const computeSentiment = (sentiments: Array<Sentiment>): number => {
  let sentimentSum = 0;
  sentiments.forEach((sentiment) => {
    if (sentiment === Sentiment.POSITIVE) {
      sentimentSum += 1;
    } else if (sentiment === Sentiment.NEGATIVE) {
      sentimentSum -= 1;
    }
  });

  return sentimentSum / sentiments.length;
};

export default recomputePostsOverallSentiment;
