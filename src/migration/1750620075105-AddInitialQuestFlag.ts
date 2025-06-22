import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInitialQuestFlag1750620075105 implements MigrationInterface {
  name = 'AddInitialQuestFlag1750620075105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quest" ADD "isInitial" boolean DEFAULT false NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quest" DROP COLUMN "isInitial"`);
  }
}
