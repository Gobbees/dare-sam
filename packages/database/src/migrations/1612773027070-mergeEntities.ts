import { MigrationInterface, QueryRunner } from 'typeorm';

export class mergeEntities1612773027070 implements MigrationInterface {
  name = 'mergeEntities1612773027070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "users_pkey"`);
    await queryRunner.query(
      `CREATE TYPE "social_profiles_source_enum" AS ENUM('FACEBOOK', 'INSTAGRAM')`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_profiles" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" "social_profiles_source_enum" NOT NULL, "external_id" character varying NOT NULL, "name" character varying NOT NULL, "picture" character varying, "ownerId" uuid NOT NULL, CONSTRAINT "UQ_60525697acfd96cfa52ed636602" UNIQUE ("source", "ownerId"), CONSTRAINT "PK_b07773de7651b6e0d11719b971a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "social_profile_id" ON "social_profiles" ("id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "posts_source_enum" AS ENUM('FACEBOOK', 'INSTAGRAM')`,
    );
    await queryRunner.query(
      `CREATE TYPE "posts_sentiment_enum" AS ENUM('3', '2', '1', '0')`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" "posts_source_enum" NOT NULL, "external_id" character varying NOT NULL, "message" character varying, "picture" character varying, "published_date" TIMESTAMP NOT NULL, "like_count" integer NOT NULL DEFAULT '0', "share_count" integer, "comment_count" integer NOT NULL DEFAULT '0', "sentiment" "posts_sentiment_enum", "comments_overall_sentiment" double precision, "parentProfileId" uuid NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "post_id" ON "posts" ("id") `);
    await queryRunner.query(
      `CREATE TYPE "comments_source_enum" AS ENUM('FACEBOOK', 'INSTAGRAM')`,
    );
    await queryRunner.query(
      `CREATE TYPE "comments_sentiment_enum" AS ENUM('3', '2', '1', '0')`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" "comments_source_enum" NOT NULL, "external_id" character varying NOT NULL, "message" character varying NOT NULL, "published_date" TIMESTAMP NOT NULL, "like_count" integer NOT NULL DEFAULT '0', "replies_count" integer NOT NULL DEFAULT '0', "sentiment" "comments_sentiment_enum", "entities_sentiment" json, "parentPostId" uuid NOT NULL, "replyToId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "comment_id" ON "comments" ("id") `,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "facebook_page_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "instagram_profile_id" uuid`,
    );
    await queryRunner.query(
      `CREATE INDEX "account_user_id" ON "accounts" ("user_id") `,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "user_id" ON "users" ("id") `);
    await queryRunner.query(
      `ALTER TABLE "social_profiles" ADD CONSTRAINT "FK_a46bd5f985245a01c2d2d3d28ab" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_b386bbbdd77e8db432fd6983dfe" FOREIGN KEY ("parentProfileId") REFERENCES "social_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_55d6ed25abd0957fdbf3c51fa76" FOREIGN KEY ("parentPostId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_7003671d633d8cd4a7e3f1933cb" FOREIGN KEY ("replyToId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_7003671d633d8cd4a7e3f1933cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_55d6ed25abd0957fdbf3c51fa76"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_b386bbbdd77e8db432fd6983dfe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_profiles" DROP CONSTRAINT "FK_a46bd5f985245a01c2d2d3d28ab"`,
    );
    await queryRunner.query(`DROP INDEX "user_id"`);
    await queryRunner.query(`DROP INDEX "account_user_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "instagram_profile_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "facebook_page_id"`,
    );
    await queryRunner.query(`DROP INDEX "comment_id"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TYPE "comments_sentiment_enum"`);
    await queryRunner.query(`DROP TYPE "comments_source_enum"`);
    await queryRunner.query(`DROP INDEX "post_id"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TYPE "posts_sentiment_enum"`);
    await queryRunner.query(`DROP TYPE "posts_source_enum"`);
    await queryRunner.query(`DROP INDEX "social_profile_id"`);
    await queryRunner.query(`DROP TABLE "social_profiles"`);
    await queryRunner.query(`DROP TYPE "social_profiles_source_enum"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "users_pkey" ON "users" ("id") `,
    );
  }
}
