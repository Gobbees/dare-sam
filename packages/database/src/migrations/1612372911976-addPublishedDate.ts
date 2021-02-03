import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPublishedDate1612372911976 implements MigrationInterface {
  name = 'addPublishedDate1612372911976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" ADD "published_date" TIMESTAMP NOT NULL DEFAULT '"1970-01-01T00:00:00.000Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" DROP COLUMN "published_date"`,
    );
  }
}
