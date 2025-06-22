import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHeroLevelColumns1750607063895 implements MigrationInterface {
  name = 'AddHeroLevelColumns1750607063895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hero" ADD "experience" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "hero" ADD "level" integer NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hero" DROP COLUMN "level"`);
    await queryRunner.query(`ALTER TABLE "hero" DROP COLUMN "experience"`);
  }
}
