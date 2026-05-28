import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUtilityUsagesToInvoice1779948571240 implements MigrationInterface {
    name = 'AddUtilityUsagesToInvoice1779948571240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" ADD "utilityUsages" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "utilityUsages"`);
    }

}
