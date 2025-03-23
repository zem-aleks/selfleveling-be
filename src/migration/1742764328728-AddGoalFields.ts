import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoalFields1742764328728 implements MigrationInterface {
  name = 'AddGoalFields1742764328728';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "score" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "followUpQuestion" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "goal" ADD "title" character varying`);
    await queryRunner.query(
      `ALTER TABLE "goal" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "goal" DROP COLUMN "followUpQuestion"`,
    );
    await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "score"`);
  }
}
