import { Icon, IconProps } from '@chakra-ui/react';
import * as React from 'react';
import {
  FaRegLaughBeam,
  FaRegMeh,
  FaRegMehBlank,
  FaRegSadTear,
} from 'react-icons/fa';
import { Sentiment } from '@crystal-ball/common';

interface SentimentEmojiProps {
  sentiment: Sentiment;
  extraStyles?: IconProps;
}

const SentimentEmoji: React.FC<SentimentEmojiProps> = (
  props: SentimentEmojiProps,
) => {
  let emojiIcon: React.ReactElement;
  // eslint-disable-next-line default-case
  switch (props.sentiment) {
    case Sentiment.Positive:
      emojiIcon = (
        <Icon as={FaRegLaughBeam} color="green.500" {...props.extraStyles} />
      );
      break;
    case Sentiment.Negative:
      emojiIcon = (
        <Icon as={FaRegSadTear} color="red.500" {...props.extraStyles} />
      );
      break;
    case Sentiment.Mixed:
      emojiIcon = (
        <Icon as={FaRegMehBlank} color="yellow.400" {...props.extraStyles} />
      );
      break;
    case Sentiment.Neutral:
      emojiIcon = (
        <Icon as={FaRegMeh} color="gray.500" {...props.extraStyles} />
      );
      break;
  }
  return emojiIcon;
};

export default SentimentEmoji;
