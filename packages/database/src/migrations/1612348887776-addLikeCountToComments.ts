import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLikeCountToComments1612348887776 implements MigrationInterface {
  name = 'addLikeCountToComments1612348887776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_comments" ADD "like_count" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_comments" DROP COLUMN "like_count"`,
    );
  }
}
