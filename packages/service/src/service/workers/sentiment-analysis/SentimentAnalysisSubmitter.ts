import {
  TextAnalyticsClient,
  AzureKeyCredential,
  AnalyzeSentimentSuccessResult,
} from '@azure/ai-text-analytics';
import { Sentiment } from '@crystal-ball/database';

export type SentimentAnalysisServiceResponse = Array<{
  id: string;
  sentiment: Sentiment;
}>;

export interface SentimentAnalysisServiceRequest {
  sentences: Array<{
    id: string;
    message: string;
  }>;
  languageCode: string;
}

/**
 * see {@link AnalyzeSentimentSuccessResult}
 */
const azureSentimentToCBSentiment = {
  positive: Sentiment.POSITIVE,
  negative: Sentiment.NEGATIVE,
  neutral: Sentiment.NEUTRAL,
  mixed: Sentiment.MIXED,
};

const MAX_API_SENTENCES = 10;

const submitToSentimentAnalysisService = async (
  request: SentimentAnalysisServiceRequest,
): Promise<SentimentAnalysisServiceResponse> => {
  if (!request.sentences.length) {
    return Promise.resolve([]);
  }
  const azureEndpoint = process.env.AZURE_ENDPOINT;
  const azureKey = process.env.AZURE_KEY;
  if (!azureEndpoint || !azureKey) {
    console.error('Missing Azure credentials.');
    return Promise.reject(new Error('Missing Azure credentials'));
  }
  const azureClient = new TextAnalyticsClient(
    azureEndpoint,
    new AzureKeyCredential(azureKey),
  );
  let splitterIndex = 0;
  const returnValue: SentimentAnalysisServiceResponse = [];
  while (splitterIndex * MAX_API_SENTENCES < request.sentences.length) {
    const azureSentences = request.sentences
      .slice(
        splitterIndex * MAX_API_SENTENCES,
        (splitterIndex + 1) * MAX_API_SENTENCES,
      )
      .map((sentence) => sentence.message);
    try {
      const sentimentResult = await azureClient.analyzeSentiment(
        azureSentences,
        request.languageCode,
      );

      for (let i = 0; i < sentimentResult.length; i += 1) {
        const sentiment =
          request.sentences[i + splitterIndex * MAX_API_SENTENCES];
        returnValue.push({
          id: sentiment.id,
          sentiment:
            azureSentimentToCBSentiment[
              (sentimentResult[i] as AnalyzeSentimentSuccessResult).sentiment
            ],
        });
      }
    } catch (error) {
      console.log(error.message);
      return Promise.reject(error);
    }
    splitterIndex += 1;
  }
  return returnValue;
};

export default submitToSentimentAnalysisService;
