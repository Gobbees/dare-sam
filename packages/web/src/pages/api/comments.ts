import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { Source } from '@crystal-ball/common';
import {
  Comment,
  SocialProfile,
  Session as NextSession,
  Post,
  User,
} from '@crystal-ball/database';
import { Comment as ClientFBComment } from '../../types';
import authenticatedRoute from '../../app/utils/apiRoutes';

// verifies that the user can access the requested resource
const verifyUserAccess = async (session: Session, postId: string) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const { postUserId } = await Post.createQueryBuilder('post')
    .innerJoin(SocialProfile, 'sp', 'post.parentProfile = sp.id')
    .innerJoin(User, 'user', 'sp.owner = user.id')
    .where('post.id = :id', { id: postId })
    .select('user.id', 'postUserId')
    .getRawOne();
  if (postUserId !== userId) {
    return Promise.reject(new Error('Missing user access'));
  }
  return Promise.resolve();
};

/**
 * Computes the permalink for a comment.
 * It currently returns a defined link for Facebook and undefined for Instagram since
 * the latter doesn't reference a Comment with a specific url.
 * @param comment the input comment.
 */
const computeCommentPermalink = (comment: Comment): string | undefined => {
  if (comment.source === Source.Facebook) {
    return `https://facebook.com/${comment.externalId}`;
  }
  return undefined;
};

/**
 * @returns an array of Comment
 */
const comments = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const postId = req.query.postid as string;
  if (!postId) {
    return res.status(400).end();
  }

  try {
    await verifyUserAccess(session, postId);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  const dbComments = await Comment.findCommentsByPost(postId);

  const apiResponse: ClientFBComment[] = [];
  dbComments.forEach((comment) =>
    apiResponse.push({
      id: comment.id,
      source: comment.source,
      message: comment.message,
      publishedDate: comment.publishedDate,
      permalink: computeCommentPermalink(comment),
      sentiment: comment.sentiment,
      likeCount: comment.likeCount,
      repliesCount: comment.repliesCount,
    }),
  );
  return res.status(200).json(JSON.stringify(apiResponse));
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, comments);
