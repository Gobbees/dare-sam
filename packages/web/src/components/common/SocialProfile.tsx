import { HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';
import { Source } from '@crystal-ball/common';
import React from 'react';
import { IoLogoFacebook, IoLogoInstagram } from 'react-icons/io5';

interface SocialProfileProps {
  source: Source;
  image: string;
  name: string;
}

const SocialProfile: React.FC<SocialProfileProps> = (
  props: SocialProfileProps,
) => (
  <VStack spacing={2} flexDir="column" align="center">
    <Image
      src={props.image}
      w={16}
      h={16}
      borderRadius="full"
      borderWidth="3px"
      borderStyle="solid"
    />
    <HStack spacing={3} align="center">
      <Icon
        as={props.source === Source.Facebook ? IoLogoFacebook : IoLogoInstagram}
        w={6}
        h={6}
      />
      <Text fontWeight="bold" fontSize="lg">
        {props.name}
      </Text>
    </HStack>
  </VStack>
);

export default SocialProfile;
