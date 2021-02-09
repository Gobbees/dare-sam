import { Comment } from '../../types';

const fetchCommentsByPost = async (postId: string): Promise<Comment[]> => {
  const url = `/api/comments?postid=${postId}`;
  const response = await fetch(url);
  const data = (await response.json()) as Comment[];
  return data;
};

export default fetchCommentsByPost;
