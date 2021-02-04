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
      name: page.name,
      picture: page.picture.data.url,
    }),
  );
  return pages;
};

export const fetchFacebookPostsForPage = async (
  page: FacebookPage,
): Promise<FacebookPost[]> => {
  const response = await fetch(`/api/facebook/posts?pageId=${page.id}`);
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
