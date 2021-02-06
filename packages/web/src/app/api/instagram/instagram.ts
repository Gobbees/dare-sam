import { sendTokenizedRequest } from '@crystal-ball/common';
import { InstagramProfile, InstagramPost } from '../../../types';

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
  const profiles: InstagramProfile[] = [];
  response.data.forEach((profile: any) => {
    const igProfile = profile.connected_instagram_account;
    profiles.push({
      id: igProfile.id,
      name: igProfile.name,
      picture: igProfile.profile_picture_url,
    });
  });
  return profiles;
};

export const fetchInstagramPostsForProfile = async (
  profile: InstagramProfile,
): Promise<InstagramPost[]> => {
  const response = await fetch(`/api/instagram/posts?profileId=${profile.id}`);
  const data = await response.json();
  return data;
};
