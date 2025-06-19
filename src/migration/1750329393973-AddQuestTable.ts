import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestTable1750329393973 implements MigrationInterface {
  name = 'AddQuestTable1750329393973';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "quest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "heroId" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "rewards" text NOT NULL, "penalties" text NOT NULL, "required" boolean NOT NULL, "status" character varying NOT NULL, "deadline" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0d6873502a58302d2ae0b82631c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "description"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "description" character varying`,
    );
    await queryRunner.query(`DROP TABLE "quest"`);
  }
}
