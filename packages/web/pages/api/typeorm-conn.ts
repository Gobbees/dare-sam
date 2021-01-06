// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TypeOrmManager } from '@crystal-ball/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  TypeOrmManager.connect({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DATABASE || 'database',
    developmentMode: process.env.NODE_ENV === 'development',
  })
    .then(() => {
      console.log('Connected', TypeOrmManager.getConnection());
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};
