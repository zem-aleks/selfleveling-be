import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSkillTables1743693520427 implements MigrationInterface {
  name = 'AddSkillTables1743693520427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "assigned_skill" ("skillId" character varying NOT NULL, "goalId" character varying NOT NULL, "heroId" character varying NOT NULL, "level" integer NOT NULL DEFAULT '1', "experience" integer NOT NULL DEFAULT '0', "vote" smallint NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0c667caafa1ff5fe9fb16c8373c" PRIMARY KEY ("skillId", "goalId", "heroId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "skill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "logoFilename" character varying, "howManyTimesUsed" integer NOT NULL DEFAULT '1', "rating" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "skill"`);
    await queryRunner.query(`DROP TABLE "assigned_skill"`);
  }
}
