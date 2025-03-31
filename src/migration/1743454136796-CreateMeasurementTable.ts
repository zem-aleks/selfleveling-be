import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMeasurementTable1743454136796 implements MigrationInterface {
  name = 'CreateMeasurementTable1743454136796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "measurement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "kpiId" character varying NOT NULL, "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_742ff3cc0dcbbd34533a9071dfd" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "measurement"`);
  }
}
