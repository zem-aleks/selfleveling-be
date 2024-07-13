import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1720882662640 implements MigrationInterface {
  name = 'CreateUsersTable1720882662640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "authId" character varying NOT NULL, "phone" character varying, "avatarUrl" character varying, "bio" text, "firstName" character varying, "lastName" character varying, "linkedIn" character varying, "website" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
