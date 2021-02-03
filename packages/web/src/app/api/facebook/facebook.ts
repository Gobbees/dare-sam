import { sendTokenizedRequest } from '@crystal-ball/common';
import { FacebookComment, FacebookPage, FacebookPost } from '../../../types';

export const getFacebookPagesForProfile = async (authToken: string) => {
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
      id: page.id,
      pageAccessToken: page.access_token,
      name: page.name,
      pictureUrl: page.picture.data.url,
    }),
  );
  return pages;
};

export const fetchFacebookPostsForPage = async (
  pages: FacebookPage[],
): Promise<FacebookPost[]> => {
  if (!pages) {
    return Promise.reject(new Error('Missing pages'));
  }
  const response = await fetch(`/api/facebook/posts?pageId=${pages[0].id}`);
  const data = await response.json();
  return data;
};

export const fetchFacebookCommentsForPost = async (
  postId: string,
): Promise<FacebookComment[]> => {
  const response = await fetch(`/api/facebook/comments?postId=${postId}`);
  const data = await response.json();
  return data as FacebookComment[];
};
