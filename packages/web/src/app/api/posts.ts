import { Post } from '../../types';

interface FetchPostsOptions {
  isFacebookSelected?: boolean;
  isInstagramSelected?: boolean;
  // this is mandatory because fetching without a
  // starting date would require too much time and it is not a useful use case
  fromDate: Date;
  // defaults to now
  sinceDate?: Date;
}

const fetchPosts = async (options: FetchPostsOptions): Promise<Post[]> => {
  const params = {
    isFacebookSelected: options.isFacebookSelected,
    isInstagramSelected: options.isInstagramSelected,
    fromDate: options.fromDate.toISOString(),
    sinceDate: options.sinceDate?.toISOString(),
  };
  const url = `/api/posts?${Object.entries(params)
    .filter((entry) => entry[1] !== undefined)
    .map((entry) => `${entry[0]}=${entry[1]}`)
    .join('&')}`;
  const response = await fetch(url);
  const data = (await response.json()) as Post[];
  return data;
};

export default fetchPosts;
