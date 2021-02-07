import submitToSentimentAnalysisService from './SentimentAnalysisSubmitter';
import recomputePostsOverallSentiment from './OverallSentimentAnalysis';
import updateSentiments from './Updater';

export * from './SentimentAnalysisSubmitter';
export {
  submitToSentimentAnalysisService,
  recomputePostsOverallSentiment,
  updateSentiments,
};
