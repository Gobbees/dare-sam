import { Icon } from '@chakra-ui/react';
import { Source } from '@crystal-ball/common';
import React from 'react';
import { IoLogoFacebook, IoLogoInstagram } from 'react-icons/io5';

interface SocialLogoProps {
  source: Source;
}

const SocialLogo: React.FC<SocialLogoProps> = ({ source }: SocialLogoProps) => (
  <Icon
    as={source === Source.Facebook ? IoLogoFacebook : IoLogoInstagram}
    w={6}
    h={6}
  />
);

export default SocialLogo;
