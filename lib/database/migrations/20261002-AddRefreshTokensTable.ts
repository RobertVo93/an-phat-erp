import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokensTable1790903412014 implements MigrationInterface {
    name = 'AddRefreshTokensTable1790903412014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."refresh_tokens_revoked_reason_enum" AS ENUM('logout', 'rotated', 'reuse_detected', 'password_changed', 'password_reset', 'user_inactive', 'role_not_allowed', 'superseded')`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "user_id" uuid NOT NULL, "family_id" uuid NOT NULL, "token_hash" character varying(64) NOT NULL, "password_fingerprint" character varying(64) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "last_used_at" TIMESTAMP, "revoked_at" TIMESTAMP, "revoked_reason" "public"."refresh_tokens_revoked_reason_enum", "replaced_by_id" uuid, CONSTRAINT "UQ_refresh_tokens_token_hash" UNIQUE ("token_hash"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_refresh_tokens_expires_at" ON "refresh_tokens" ("expires_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_refresh_tokens_family_id" ON "refresh_tokens" ("family_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_refresh_tokens_user_id" ON "refresh_tokens" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_refresh_tokens_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_refresh_tokens_family_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_refresh_tokens_expires_at"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TYPE "public"."refresh_tokens_revoked_reason_enum"`);
    }

}
