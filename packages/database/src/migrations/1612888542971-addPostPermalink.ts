import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPostPermalink1612888542971 implements MigrationInterface {
  name = 'addPostPermalink1612888542971';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "permalink" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "permalink"`);
  }
}
