import { MigrationInterface, QueryRunner } from 'typeorm';

export class addInstagram1612529227333 implements MigrationInterface {
  name = 'addInstagram1612529227333';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "page_pkey"`);
    await queryRunner.query(`DROP INDEX "post_pkey"`);
    await queryRunner.query(`DROP INDEX "comment_id"`);
    await queryRunner.query(
      `CREATE TYPE "instagram_comments_overall_sentiment_enum" AS ENUM('2', '1', '0', '-1')`,
    );
    await queryRunner.query(
      `CREATE TABLE "instagram_comments" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "message" character varying, "published_date" TIMESTAMP NOT NULL DEFAULT '"1970-01-01T00:00:00.000Z"', "like_count" integer NOT NULL DEFAULT '0', "entities_sentiment" json, "overall_sentiment" "instagram_comments_overall_sentiment_enum", "replies_count" integer NOT NULL DEFAULT '0', "postId" character varying, "replyToId" character varying, CONSTRAINT "PK_46aeedf52715cd8265a1c066f66" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "ig_comment_id" ON "instagram_comments" ("id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "instagram_posts_post_sentiment_enum" AS ENUM('2', '1', '0', '-1')`,
    );
    await queryRunner.query(
      `CREATE TABLE "instagram_posts" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "message" character varying, "picture_url" character varying, "like_count" integer NOT NULL, "comments_count" integer NOT NULL DEFAULT '0', "published_date" TIMESTAMP NOT NULL DEFAULT '"1970-01-01T00:00:00.000Z"', "post_sentiment" "instagram_posts_post_sentiment_enum", "comments_overall_sentiment" double precision, "profileId" character varying, CONSTRAINT "PK_b6eb3b68310ccbced538a68379e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "ig_post_pkey" ON "instagram_posts" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "instagram_profiles" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" character varying NOT NULL, "name" character varying NOT NULL, "picture" character varying NOT NULL, "ownerId" uuid, CONSTRAINT "REL_ecb0e882dec0bea7d5d893b774" UNIQUE ("ownerId"), CONSTRAINT "PK_18f221e6b8351a57dbd617b93b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "ig_profile_pkey" ON "instagram_profiles" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "fb_page_pkey" ON "facebook_pages" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "fb_post_pkey" ON "facebook_posts" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "fb_comment_id" ON "facebook_comments" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "instagram_comments" ADD CONSTRAINT "FK_e301282bf3bdd2416eb6c508e4b" FOREIGN KEY ("postId") REFERENCES "instagram_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instagram_comments" ADD CONSTRAINT "FK_ab335de7ff67f180eb1949017e5" FOREIGN KEY ("replyToId") REFERENCES "instagram_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instagram_posts" ADD CONSTRAINT "FK_33750c984e01901c451d179e05f" FOREIGN KEY ("profileId") REFERENCES "instagram_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instagram_profiles" ADD CONSTRAINT "FK_ecb0e882dec0bea7d5d893b774b" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instagram_profiles" DROP CONSTRAINT "FK_ecb0e882dec0bea7d5d893b774b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instagram_posts" DROP CONSTRAINT "FK_33750c984e01901c451d179e05f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instagram_comments" DROP CONSTRAINT "FK_ab335de7ff67f180eb1949017e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instagram_comments" DROP CONSTRAINT "FK_e301282bf3bdd2416eb6c508e4b"`,
    );
    await queryRunner.query(`DROP INDEX "fb_comment_id"`);
    await queryRunner.query(`DROP INDEX "fb_post_pkey"`);
    await queryRunner.query(`DROP INDEX "fb_page_pkey"`);
    await queryRunner.query(`DROP INDEX "ig_profile_pkey"`);
    await queryRunner.query(`DROP TABLE "instagram_profiles"`);
    await queryRunner.query(`DROP INDEX "ig_post_pkey"`);
    await queryRunner.query(`DROP TABLE "instagram_posts"`);
    await queryRunner.query(`DROP TYPE "instagram_posts_post_sentiment_enum"`);
    await queryRunner.query(`DROP INDEX "ig_comment_id"`);
    await queryRunner.query(`DROP TABLE "instagram_comments"`);
    await queryRunner.query(
      `DROP TYPE "instagram_comments_overall_sentiment_enum"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "comment_id" ON "facebook_comments" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "post_pkey" ON "facebook_posts" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "page_pkey" ON "facebook_pages" ("id") `,
    );
  }
}
