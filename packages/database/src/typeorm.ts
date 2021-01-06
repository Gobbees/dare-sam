import path from 'path';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

const defaultParams = {
  type: 'postgres',
  entities: [path.join(__dirname, '/entities/**/*.js')],
  migrations: [path.join(__dirname, '/migrations/**/*.js')],
};
export interface TypeOrmManagerConnectionParameters {
  /**
   * Host name.
   */
  host: string;
  /**
   * Host port
   */
  port: number;
  /**
   * Host username
   */
  username: string;
  /**
   * Host password
   */
  password: string;
  /**
   * Database name
   */
  database: string;
  /**
   * Development mode enabled.
   * If this is enabled, automatically the database drops the
   * schema and creates the new schema every time the application starts
   */
  developmentMode: boolean;
}

export class TypeOrmManager {
  private static connection: Connection | undefined;

  public static async connect(
    connectionParameters: TypeOrmManagerConnectionParameters,
  ) {
    this.connection = await createConnection({
      ...defaultParams,
      host: connectionParameters.host,
      port: connectionParameters.port,
      username: connectionParameters.username,
      password: connectionParameters.password,
      database: connectionParameters.database,
      dropSchema: connectionParameters.developmentMode,
      synchronize: connectionParameters.developmentMode,
    } as ConnectionOptions);
    console.log(this.connection.entityMetadatas);
  }

  public static getConnection() {
    if (!this.connection) {
      throw new Error(
        'The connection has not been initialized. Please initialize it through TypeOrmManager.connect()',
      );
    }
    return this.connection;
  }
}
