import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStockChangeProductionReference1779695519780 implements MigrationInterface {
    name = 'AddStockChangeProductionReference1779695519780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_change" ADD "production_record_id" uuid`);
        await queryRunner.query(`ALTER TABLE "stock_change" ADD CONSTRAINT "FK_db8a70c78a7914916cd0d4233c9" FOREIGN KEY ("production_record_id") REFERENCES "production_records"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_change" DROP CONSTRAINT "FK_db8a70c78a7914916cd0d4233c9"`);
        await queryRunner.query(`ALTER TABLE "stock_change" DROP COLUMN "production_record_id"`);
    }

}
