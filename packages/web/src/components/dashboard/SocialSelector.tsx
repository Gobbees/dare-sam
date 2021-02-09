import { Box, Button, HStack, StackDivider, Text } from '@chakra-ui/react';
import { Source } from '@crystal-ball/common';
import React from 'react';
import { User } from '../../types';
import SocialProfile from '../common/SocialProfile';

interface SocialSelectorProps {
  user: User;
  facebookSelected: boolean;
  instagramSelected: boolean;
  onFacebookSelect: () => void;
  onInstagramSelect: () => void;
}

const SocialSelector: React.FC<SocialSelectorProps> = (
  props: SocialSelectorProps,
) => {
  const profiles: React.ReactNode[] = [];
  if (props.user.facebookPage) {
    const page = props.user.facebookPage;
    profiles.push(
      <Button
        key={page.id}
        w="auto"
        h="auto"
        p={4}
        shadow="lg"
        colorScheme={props.facebookSelected ? 'facebook' : 'gray'}
        borderRadius="lg"
        onClick={() => props.onFacebookSelect()}
      >
        <SocialProfile
          key={page.id}
          source={Source.Facebook}
          image={page.picture}
          name={page.name}
        />
      </Button>,
    );
  }
  if (props.user.instagramProfile) {
    const profile = props.user.instagramProfile;
    profiles.push(
      <Button
        key={profile.id}
        w="auto"
        h="auto"
        p={4}
        shadow="lg"
        bg={props.instagramSelected ? 'instagram.500' : 'gray.100'}
        _hover={{
          bg: props.instagramSelected ? 'instagram.600' : 'gray.200',
        }}
        borderRadius="lg"
        textColor={props.instagramSelected ? 'white' : 'black'}
        onClick={() => props.onInstagramSelect()}
      >
        <SocialProfile
          key={profile.id}
          source={Source.Instagram}
          image={profile.picture}
          name={profile.name}
        />
      </Button>,
    );
  }
  return (
    <Box py={6}>
      {profiles.length ? (
        <HStack
          spacing={8}
          divider={
            <StackDivider orientation="vertical" borderColor="gray.100" />
          }
        >
          {profiles}
        </HStack>
      ) : (
        <Text>You don't have any linked account yet.</Text>
      )}
    </Box>
  );
};

export default SocialSelector;
