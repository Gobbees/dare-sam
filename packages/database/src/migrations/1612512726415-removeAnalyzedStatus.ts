import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeAnalyzedStatus1612512726415 implements MigrationInterface {
  name = 'removeAnalyzedStatus1612512726415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" DROP COLUMN "analyzed_status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."facebook_posts_analyzed_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_comments" DROP COLUMN "analyzed_status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."facebook_comments_analyzed_status_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."facebook_comments_analyzed_status_enum" AS ENUM('1', '0')`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_comments" ADD "analyzed_status" "facebook_comments_analyzed_status_enum" NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."facebook_posts_analyzed_status_enum" AS ENUM('1', '0')`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_posts" ADD "analyzed_status" "facebook_posts_analyzed_status_enum" NOT NULL DEFAULT '0'`,
    );
  }
}
