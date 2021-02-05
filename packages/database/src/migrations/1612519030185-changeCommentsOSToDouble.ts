import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeCommentsOSToDouble1612519030185
  implements MigrationInterface {
  name = 'changeCommentsOSToDouble1612519030185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" ALTER COLUMN "comments_overall_sentiment" TYPE double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" ALTER COLUMN "comments_overall_sentiment" TYPE integer`,
    );
  }
}
