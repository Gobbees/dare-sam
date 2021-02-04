import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import {
  FacebookPage,
  FacebookPost,
  Session as NextSession,
} from '@crystal-ball/database';
import authenticatedRoute from '../../../app/utils/apiRoutes';
import { FacebookPost as ClientFacebookPost } from '../../../types';

/**
 * @returns an array of FacebookPost ordered by published date
 */
const posts = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const { pageId } = req.query;
  if (!pageId) {
    return res.status(400).end();
  }

  const facebookPage = await FacebookPage.findOne({
    where: { id: pageId, owner: userId },
  });
  if (!facebookPage) {
    return res.status(404).end();
  }

  const dbPosts = await FacebookPost.find({
    where: { page: facebookPage.id },
    order: { publishedDate: 'DESC' },
  });

  const facebookPosts: ClientFacebookPost[] = [];
  dbPosts.forEach((post) =>
    facebookPosts.push({
      id: post.id,
      message: post.message,
      publishedDate: post.publishedDate,
      postSentiment: post.postSentiment,
      likesCount: post.likeCount,
      sharesCount: post.sharesCount,
      commentsCount: post.commentsCount,
    }),
  );
  return res.status(200).json(JSON.stringify(facebookPosts));
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, posts);
