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
   * If this is enabled, automatically the database
   * updates the new schema every time the application starts
   * and extra logging is provided
   */
  developmentMode: boolean;
}

export class TypeOrmManager {
  private static connection: Connection | undefined;

  public static async connect(
    connectionParameters: TypeOrmManagerConnectionParameters,
  ) {
    if (this.connection) {
      await this.connection.connect();
    } else {
      this.connection = await createConnection({
        ...defaultParams,
        host: connectionParameters.host,
        port: connectionParameters.port,
        username: connectionParameters.username,
        password: connectionParameters.password,
        database: connectionParameters.database,
        debug: connectionParameters.developmentMode,
        synchronize: connectionParameters.developmentMode,
      } as ConnectionOptions);
    }
  }

  public static getConnection() {
    return this.connection;
  }

  public static isConnected() {
    return this.connection ? this.connection.isConnected : false;
  }

  /**
   * Closes the connection if it is established.
   */
  public static async maybeCloseConnection() {
    if (this.connection?.isConnected) {
      await this.connection.close();
    }
  }
}
