import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessagesAndThreadsTables1721210896993
  implements MigrationInterface
{
  name = 'CreateMessagesAndThreadsTables1721210896993';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "thread" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "modelType" character varying NOT NULL, "temperature" double precision NOT NULL, "systemPrompt" character varying NOT NULL, "systemPromptTokens" integer NOT NULL, "tokensUsed" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chatId" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_cabc0f3f27d7b1c70cf64623e02" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" text NOT NULL, "role" character varying NOT NULL, "tokens" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chatId" character varying NOT NULL, "userId" character varying NOT NULL, "threadId" character varying NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "thread"`);
  }
}
