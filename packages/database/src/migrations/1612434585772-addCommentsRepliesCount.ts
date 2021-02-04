import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCommentsRepliesCount1612434585772
  implements MigrationInterface {
  name = 'addCommentsRepliesCount1612434585772';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_comments" ADD "replies_count" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_comments" DROP COLUMN "replies_count"`,
    );
  }
}
