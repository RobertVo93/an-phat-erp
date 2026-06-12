import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSaleableFieldToCollectionTable1781248451074 implements MigrationInterface {
    name = 'AddSaleableFieldToCollectionTable1781248451074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collections" ADD "saleable" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "collections" DROP COLUMN "saleable"`);
    }

}
