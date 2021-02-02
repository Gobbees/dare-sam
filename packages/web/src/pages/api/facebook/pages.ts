import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, Session } from 'next-auth/client';
import { FacebookPage, Session as NextSession } from '@crystal-ball/database';
import typeOrmConnect from '../../../app/utils/typeOrmConnect';
import { FacebookPage as ClientFBPage } from '../../../types/types';

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
      picture: page.pictureUrl,
      pageOwner: userId,
    });
    console.log('Done');
    return res.status(200).end();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: error.message });
  }
};

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
  if (req.method === 'POST') {
    return createPage(req, res, session);
  }
  return res.status(404).end();
};
