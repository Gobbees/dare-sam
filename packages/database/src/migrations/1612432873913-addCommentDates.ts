import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCommentDates1612432873913 implements MigrationInterface {
  name = 'addCommentDates1612432873913';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_comments" ADD "published_date" TIMESTAMP NOT NULL DEFAULT '"1970-01-01T00:00:00.000Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_comments" DROP COLUMN "published_date"`,
    );
  }
}
