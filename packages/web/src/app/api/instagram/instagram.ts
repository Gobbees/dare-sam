import { sendTokenizedRequest, Source } from '@crystal-ball/common';
import { SocialProfile } from '../../../types';

// eslint-disable-next-line import/prefer-default-export
export const getInstagramProfilesForProfile = async (authToken: string) => {
  const response = await sendTokenizedRequest(
    'me/accounts?fields=connected_instagram_account{id,name,profile_picture_url}',
    true,
    authToken,
  );
  if (!response) {
    return undefined;
  }
  const profiles: SocialProfile[] = [];
  response.data.forEach((profile: any) => {
    const igProfile = profile.connected_instagram_account;
    profiles.push({
      id: igProfile.id,
      source: Source.Instagram,
      name: igProfile.name,
      picture: igProfile.profile_picture_url,
    });
  });
  return profiles;
};
