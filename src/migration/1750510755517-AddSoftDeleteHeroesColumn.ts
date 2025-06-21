import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSoftDeleteHeroesColumn1750510755517
  implements MigrationInterface
{
  name = 'AddSoftDeleteHeroesColumn1750510755517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hero" ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hero" DROP COLUMN "deletedAt"`);
  }
}
