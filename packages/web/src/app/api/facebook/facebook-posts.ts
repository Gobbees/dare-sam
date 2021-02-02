import { FacebookPost } from '@crystal-ball/database';
import { FacebookPage } from '../../../types';

export default async function fetchFacebookPostsForPage(
  pages: FacebookPage[] | undefined,
): Promise<FacebookPost[]> {
  if (!pages) {
    return Promise.reject(new Error('Missing pages'));
  }
  const response = await fetch(`/api/facebook/posts?pageId=${pages[0].id}`);
  const data = await response.json();
  console.log(data);
  return data;
}
