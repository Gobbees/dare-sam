import { TypeOrmManager } from '@crystal-ball/database';

const typeOrmConnect = async () => {
  if (!TypeOrmManager.isConnected()) {
    await TypeOrmManager.connect({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USERNAME || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DATABASE || 'database',
      developmentMode: false, // process.env.NODE_ENV === 'development',
    });
  }
};

export default typeOrmConnect;
