import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSkillStatusColumn1743766820638 implements MigrationInterface {
  name = 'AddSkillStatusColumn1743766820638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assigned_skill" ADD "status" character varying NOT NULL DEFAULT 'draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assigned_skill" DROP COLUMN "status"`,
    );
  }
}
