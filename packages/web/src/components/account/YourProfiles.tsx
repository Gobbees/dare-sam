import { Box, Flex, HStack, StackDivider, Text } from '@chakra-ui/react';
import { Source } from '@crystal-ball/common';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { User } from '../../types';
import SocialProfile from '../common/SocialProfile';
import RemoveAccountPopover from './RemoveProfilePopover';

interface YourProfilesProps {
  user: User;
}

const YourProfilesSection: React.FC<YourProfilesProps> = ({
  user,
}: YourProfilesProps) => {
  const queryClient = useQueryClient();
  const facebookRemoveProfileMutation = useMutation(
    async () => {
      const response = await fetch('/api/facebook/pages/', {
        method: 'DELETE',
      });
      if (response.status >= 400) {
        const data = await response.json();
        return Promise.reject(new Error(data.error));
      }
      return Promise.resolve();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
    },
  );
  const instagramRemoveProfileMutation = useMutation(
    async () => {
      const response = await fetch('/api/instagram/profiles/', {
        method: 'DELETE',
      });
      if (response.status >= 400) {
        const data = await response.json();
        return Promise.reject(new Error(data.error));
      }
      return Promise.resolve();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('user');
      },
    },
  );

  const profiles: React.ReactNode[] = [];
  if (user.facebookPage) {
    const page = user.facebookPage;
    profiles.push(
      <Flex flexDir="row" align="flex-start" key={page.id}>
        <RemoveAccountPopover
          onConfirm={facebookRemoveProfileMutation.mutate}
        />
        <SocialProfile
          source={Source.Facebook}
          image={page.picture}
          name={page.name}
        />
      </Flex>,
    );
  }
  if (user.instagramProfile) {
    const profile = user.instagramProfile;
    profiles.push(
      <Flex flexDir="row" align="flex-start" key={profile.id}>
        <RemoveAccountPopover
          onConfirm={instagramRemoveProfileMutation.mutate}
        />
        <SocialProfile
          source={Source.Instagram}
          image={profile.picture}
          name={profile.name}
        />
      </Flex>,
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

export default YourProfilesSection;
