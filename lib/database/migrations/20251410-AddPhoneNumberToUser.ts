import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumberToUser1760418234407 implements MigrationInterface {
    name = 'AddPhoneNumberToUser1760418234407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }

}
