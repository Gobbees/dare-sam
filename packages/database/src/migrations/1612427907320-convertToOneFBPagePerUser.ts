import { MigrationInterface, QueryRunner } from 'typeorm';

export class convertToOneFBPagePerUser1612427907320
  implements MigrationInterface {
  name = 'convertToOneFBPagePerUser1612427907320';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" DROP CONSTRAINT "FK_7ed7357a2fa2447fb93c944c203"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" DROP COLUMN "page_owner"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" DROP COLUMN "pageOwnerId"`,
    );
    await queryRunner.query(`ALTER TABLE "facebook_pages" ADD "ownerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" ADD CONSTRAINT "UQ_0f689d2d32806615e420877b0bd" UNIQUE ("ownerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" ADD CONSTRAINT "FK_0f689d2d32806615e420877b0bd" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" DROP CONSTRAINT "FK_0f689d2d32806615e420877b0bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" DROP CONSTRAINT "UQ_0f689d2d32806615e420877b0bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" DROP COLUMN "ownerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" ADD "pageOwnerId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" ADD "page_owner" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "facebook_pages" ADD CONSTRAINT "FK_7ed7357a2fa2447fb93c944c203" FOREIGN KEY ("pageOwnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
