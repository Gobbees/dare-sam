import { sendTokenizedRequest, Source } from '@crystal-ball/common';
import { SocialProfile } from '../../../types';

// eslint-disable-next-line import/prefer-default-export
export const getFacebookPagesForProfile = async (authToken: string) => {
  const response = await sendTokenizedRequest(
    'me/accounts?fields=id,access_token,name,picture{url}',
    true,
    authToken,
  );
  if (!response) {
    return undefined;
  }
  const pages: SocialProfile[] = [];
  response.data.forEach((page: any) =>
    pages.push({
      id: page.id,
      source: Source.Facebook,
      name: page.name,
      picture: page.picture.data.url,
    }),
  );
  return pages;
};
