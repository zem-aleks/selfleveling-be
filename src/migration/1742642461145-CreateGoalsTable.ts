import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGoalsTable1742642461145 implements MigrationInterface {
  name = 'CreateGoalsTable1742642461145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "goal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "heroId" character varying NOT NULL, "threadId" uuid NOT NULL DEFAULT uuid_generate_v4(), "goal" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "goal"`);
  }
}
