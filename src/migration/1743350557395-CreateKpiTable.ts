import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKpiTable1743350557395 implements MigrationInterface {
  name = 'CreateKpiTable1743350557395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "kpi" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "goalId" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "targetValue" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_56589835e31cc0331684d2d28a7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "kpi"`);
  }
}
