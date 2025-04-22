import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGoalsTable1743941915885 implements MigrationInterface {
  name = 'UpdateGoalsTable1743941915885';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "score"`);
    await queryRunner.query(
      `ALTER TABLE "goal" DROP COLUMN "followUpQuestion"`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "evaluation" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "targetDate" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "targetDate"`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "evaluation"`);
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "followUpQuestion" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "score" integer NOT NULL DEFAULT '0'`,
    );
  }
}
