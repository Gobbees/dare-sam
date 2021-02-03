import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, Session } from 'next-auth/client';
import typeOrmConnect from './typeOrmConnect';

const authenticatedRoute = async (
  req: NextApiRequest,
  res: NextApiResponse,
  route: (req: NextApiRequest, res: NextApiResponse, session: Session) => any,
) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).end();
  }
  try {
    await typeOrmConnect();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  return route(req, res, session);
};

export default authenticatedRoute;
