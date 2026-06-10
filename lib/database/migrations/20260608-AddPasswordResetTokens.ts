import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordResetTokens1780905200000 implements MigrationInterface {
    name = 'AddPasswordResetTokens1780905200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_reset_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "user_id" uuid NOT NULL, "token_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP, CONSTRAINT "PK_688e80b0266f6df2874b7a4a76d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_password_reset_tokens_token_hash" ON "password_reset_tokens" ("token_hash")`);
        await queryRunner.query(`CREATE INDEX "IDX_password_reset_tokens_user_id" ON "password_reset_tokens" ("user_id")`);
        await queryRunner.query(`ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "FK_password_reset_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "FK_password_reset_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_password_reset_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_password_reset_tokens_token_hash"`);
        await queryRunner.query(`DROP TABLE "password_reset_tokens"`);
    }

}
