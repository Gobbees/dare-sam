import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import {
  FacebookPost,
  Session as NextSession,
  User,
} from '@crystal-ball/database';
import { FacebookComment } from '../../../types';
import authenticatedRoute from '../../../app/utils/apiRoutes';

// verifies that the user can access the requested resource
const verifyUserAccess = async (
  session: Session,
  facebookPost: FacebookPost,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const user = await User.findOne(userId, { relations: ['facebookPages'] });
  if (
    !(
      user &&
      user.facebookPages?.map((page) => page.id).includes(facebookPost.page.id)
    )
  ) {
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

  const facebookPost = await FacebookPost.findOne({
    where: { id: postId },
    relations: ['comments', 'page'],
  });

  if (!facebookPost) {
    return res.status(404).end();
  }

  try {
    await verifyUserAccess(session, facebookPost);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  const facebookComments: FacebookComment[] = [];
  facebookPost.comments.forEach((comment) =>
    facebookComments.push({
      id: comment.id,
      message: comment.message,
      sentiment: comment.overallSentiment,
    }),
  );
  return res.status(200).json(JSON.stringify(facebookComments));
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, comments);
