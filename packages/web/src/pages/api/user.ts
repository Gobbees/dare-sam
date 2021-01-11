import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, Session } from 'next-auth/client';
import { Session as NextSession, User } from '@crystal-ball/database';
import typeOrmConnect from '../../app/utils/typeOrmConnect';
import { User as ClientUser, FacebookPage } from '../../types/types';

const getUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const user = await User.findOneOrFail({
    where: { id: userId },
    relations: ['facebookPages'],
  });
  const pages: FacebookPage[] = [];
  user.facebookPages?.forEach((page) =>
    pages.push({
      pid: page.externalId,
      pictureUrl: page.picture,
      name: page.name,
    }),
  );
  const result: ClientUser = {
    name: user.name || undefined,
    email: user.email || undefined,
    image: user.image || undefined,
    facebookAccessToken: user.facebookAccessToken,
    facebookPages: pages,
  };
  res.json(JSON.stringify(result));
};

const updateUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) => {
  const { userId } = await NextSession.findOneOrFail({
    where: { accessToken: session.accessToken },
    select: ['userId'],
  });
  const user: any = {};
  console.log(req.body);
  if (req.body.facebookAccessToken) {
    user.facebookAccessToken = req.body.facebookAccessToken;
  }
  if (req.body.isLongLivedToken !== undefined) {
    user.isFacebookAccessTokenLLT = req.body.isLongLivedToken;
  } else {
    return res.status(400).end();
  }
  try {
    await User.update({ id: userId }, { ...user });
    return res.status(200).end();
  } catch (error) {
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

  if (req.method === 'GET') {
    return getUser(req, res, session);
  }
  if (req.method === 'POST') {
    return updateUser(req, res, session);
  }
  return res.status(404).end();
};
