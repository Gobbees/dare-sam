import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { FacebookPage, Session as NextSession } from '@crystal-ball/database';
import typeOrmConnect from '../../../app/utils/typeOrmConnect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).end();
  }
  try {
    await typeOrmConnect();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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
