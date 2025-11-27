import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupCheckoutCart1764241896211 implements MigrationInterface {
    name = 'SetupCheckoutCart1764241896211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "UQ_11d81cd7be87b6f8865b0cf7661" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "receiverInfo" jsonb`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying(255)`);
        await queryRunner.query(`ALTER TYPE "public"."orders_paymentmethod_enum" RENAME TO "orders_paymentmethod_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentmethod_enum" AS ENUM('creditCard', 'debitCard', 'bankTransfer', 'cash', 'paypal', 'momo')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentMethod" TYPE "public"."orders_paymentmethod_enum" USING "paymentMethod"::"text"::"public"."orders_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentmethod_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."orders_paymentmethod_enum_old" AS ENUM('creditCard', 'debitCard', 'bankTransfer', 'cash', 'paypal')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "paymentMethod" TYPE "public"."orders_paymentmethod_enum_old" USING "paymentMethod"::"text"::"public"."orders_paymentmethod_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."orders_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_paymentmethod_enum_old" RENAME TO "orders_paymentmethod_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "receiverInfo"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "UQ_11d81cd7be87b6f8865b0cf7661"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "user_id"`);
    }

}
