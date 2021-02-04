import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth/client';
import { FacebookPage, Session as NextSession } from '@crystal-ball/database';
import { FacebookPage as ClientFBPage } from '../../../types';
import authenticatedRoute from '../../../app/utils/apiRoutes';

const createPage = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const page: ClientFBPage = { ...req.body.page };

  try {
    await FacebookPage.insert({
      id: page.id,
      name: page.name,
      picture: page.picture,
      owner: () => userId,
    });
    return res.status(200).end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const pages = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  if (req.method === 'POST') {
    return createPage(req, res, session);
  }
  return res.status(404).end();
};

export default async (req: NextApiRequest, res: NextApiResponse) =>
  authenticatedRoute(req, res, pages);
