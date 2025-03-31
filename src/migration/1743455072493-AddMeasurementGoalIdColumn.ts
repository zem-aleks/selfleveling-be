import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMeasurementGoalIdColumn1743455072493
  implements MigrationInterface
{
  name = 'AddMeasurementGoalIdColumn1743455072493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "measurement" ADD "goalId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "measurement" DROP COLUMN "goalId"`);
  }
}
