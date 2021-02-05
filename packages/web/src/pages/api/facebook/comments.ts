import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import {
  FacebookComment,
  FacebookPage,
  Session as NextSession,
} from '@crystal-ball/database';
import { FacebookComment as ClientFBComment } from '../../../types';
import authenticatedRoute from '../../../app/utils/apiRoutes';

// verifies that the user can access the requested resource
const verifyUserAccess = async (session: Session, postId: string) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const pageWithPosts = await FacebookPage.findOne({
    where: { owner: userId },
    relations: ['posts'],
  });
  if (!pageWithPosts?.posts.map((post) => post.id).includes(postId)) {
    return Promise.reject(new Error('Missing user access'));
  }
  return Promise.resolve();
};

/**
 * @returns an array of FacebookComment
 */
const comments = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const postId = req.query.postId as string;
  if (!postId) {
    return res.status(400).end();
  }

  try {
    await verifyUserAccess(session, postId);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  const facebookComments = await FacebookComment.findCommentsByPost(postId);

  const apiResponse: ClientFBComment[] = [];
  facebookComments.forEach((comment) =>
    apiResponse.push({
      id: comment.id,
      message: comment.message,
      sentiment: comment.overallSentiment,
      likeCount: comment.likeCount,
    }),
  );
  return res.status(200).json(JSON.stringify(apiResponse));
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, comments);
