import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCustomerConstraint1780903069750 implements MigrationInterface {
    name = 'UpdateCustomerConstraint1780903069750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "CHK_36331e70f0e3590052b9af2aee" CHECK ("id" = "user_id")`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "CHK_36331e70f0e3590052b9af2aee"`);
        await queryRunner.query(`ALTER TABLE "customers" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
