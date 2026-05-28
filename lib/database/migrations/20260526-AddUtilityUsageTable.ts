import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUtilityUsageTable1779765252305 implements MigrationInterface {
    name = 'AddUtilityUsageTable1779765252305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."utility_usage_status_enum" AS ENUM('draft', 'waitForApproval', 'approved', 'completed')`);
        await queryRunner.query(`CREATE TABLE "utility_usage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "number" character varying, "usageTime" TIMESTAMP, "unit" "public"."utilities_unit_enum", "amountBefore" double precision, "amountAfter" double precision, "totalUsage" double precision, "status" "public"."utility_usage_status_enum" NOT NULL DEFAULT 'draft', "note" character varying, "recorder_id" uuid, "approver_id" uuid, "utility_id" uuid, CONSTRAINT "UQ_8808c2c8b32789aa1ffaa7b86e0" UNIQUE ("number"), CONSTRAINT "PK_39558ed3af1362231b0e5f72bc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "utility_usage" ADD CONSTRAINT "FK_162af48cc611ad865a3718e5159" FOREIGN KEY ("recorder_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utility_usage" ADD CONSTRAINT "FK_164b05d68cbb01ced7c89042f7a" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "utility_usage" ADD CONSTRAINT "FK_d0d65782cf24446967de56927c6" FOREIGN KEY ("utility_id") REFERENCES "utilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "utility_usage" DROP CONSTRAINT "FK_d0d65782cf24446967de56927c6"`);
        await queryRunner.query(`ALTER TABLE "utility_usage" DROP CONSTRAINT "FK_164b05d68cbb01ced7c89042f7a"`);
        await queryRunner.query(`ALTER TABLE "utility_usage" DROP CONSTRAINT "FK_162af48cc611ad865a3718e5159"`);
        await queryRunner.query(`DROP TABLE "utility_usage"`);
        await queryRunner.query(`DROP TYPE "public"."utility_usage_status_enum"`);
    }

}
