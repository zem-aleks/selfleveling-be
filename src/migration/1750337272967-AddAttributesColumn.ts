import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttributesColumn1750337272967 implements MigrationInterface {
  name = 'AddAttributesColumn1750337272967';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hero" ADD "attributes" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hero" DROP COLUMN "attributes"`);
  }
}
