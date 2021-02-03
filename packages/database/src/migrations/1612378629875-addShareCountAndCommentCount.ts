import { MigrationInterface, QueryRunner } from 'typeorm';

export class addShareCountAndCommentCount1612378629875
  implements MigrationInterface {
  name = 'addShareCountAndCommentCount1612378629875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" ADD "shares_count" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" ADD "comments_count" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" DROP COLUMN "comments_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" DROP COLUMN "shares_count"`,
    );
  }
}
