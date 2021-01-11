import { sendTokenizedRequest } from '@crystal-ball/common';
import { FacebookPage } from '../../types';

const getFacebookPagesForProfile = async (authToken: string) => {
  const response = await sendTokenizedRequest(
    'me/accounts?fields=id,access_token,name,picture{url}',
    true,
    authToken,
  );
  if (!response) {
    return undefined;
  }
  const pages: FacebookPage[] = [];
  response.data.forEach((page: any) =>
    pages.push({
      pid: page.id,
      pageAccessToken: page.access_token,
      name: page.name,
      pictureUrl: page.picture.data.url,
    }),
  );

  return pages;
};

export default getFacebookPagesForProfile;
