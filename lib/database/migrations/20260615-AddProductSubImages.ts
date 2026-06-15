import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductSubImages1781489487028 implements MigrationInterface {
    name = 'AddProductSubImages1781489487028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "sub_images" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sub_images"`);
    }

}
