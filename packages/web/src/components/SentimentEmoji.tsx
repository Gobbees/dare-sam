import { Icon, IconProps } from '@chakra-ui/react';
import * as React from 'react';
import {
  FaRegLaughBeam,
  FaRegMeh,
  FaRegMehBlank,
  FaRegSadTear,
} from 'react-icons/fa';
import { Sentiment } from '../types';

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
    case Sentiment.POSITIVE:
      emojiIcon = (
        <Icon as={FaRegLaughBeam} color="green.500" {...props.extraStyles} />
      );
      break;
    case Sentiment.NEGATIVE:
      emojiIcon = (
        <Icon as={FaRegSadTear} color="red.500" {...props.extraStyles} />
      );
      break;
    case Sentiment.MIXED:
      emojiIcon = (
        <Icon as={FaRegMehBlank} color="yellow.400" {...props.extraStyles} />
      );
      break;
    case Sentiment.NEUTRAL:
      emojiIcon = <Icon as={FaRegMeh} {...props.extraStyles} />;
      break;
  }
  return emojiIcon;
};

export default SentimentEmoji;
