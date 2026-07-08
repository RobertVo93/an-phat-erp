import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductTierPrices1782038400000 implements MigrationInterface {
    name = 'AddProductTierPrices1782038400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "tier_prices" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "tier_prices"`);
    }
}
