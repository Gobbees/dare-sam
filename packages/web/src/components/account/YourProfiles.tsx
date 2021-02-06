import { Box, HStack, StackDivider, Text } from '@chakra-ui/react';
import React from 'react';
import { Social, User } from '../../types';
import SocialProfile from '../common/SocialProfile';

interface YourProfilesProps {
  user: User;
}

const YourProfilesSection: React.FC<YourProfilesProps> = ({
  user,
}: YourProfilesProps) => {
  const profiles: React.ReactNode[] = [];
  if (user.facebookPage) {
    const page = user.facebookPage;
    profiles.push(
      <SocialProfile
        key={page.id}
        social={Social.Facebook}
        image={page.picture}
        name={page.name}
      />,
    );
  }
  if (user.instagramProfile) {
    const profile = user.instagramProfile;
    profiles.push(
      <SocialProfile
        key={profile.id}
        social={Social.Instagram}
        image={profile.picture}
        name={profile.name}
      />,
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
