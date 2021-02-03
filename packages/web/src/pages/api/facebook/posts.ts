import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { FacebookPage, Session as NextSession } from '@crystal-ball/database';
import authenticatedRoute from '../../../app/utils/apiRoutes';

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
    where: { id: pageId, pageOwner: userId },
    relations: ['posts'],
  });
  if (!facebookPage) {
    return res.status(404).end();
  }

  return res.status(200).json(JSON.stringify(facebookPage.posts));
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, posts);
