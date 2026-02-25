import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupNotification1771908120934 implements MigrationInterface {
    name = 'SetupNotification1771908120934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('system', 'order', 'message', 'promotion')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "data" jsonb, "url" text, "isRead" boolean NOT NULL DEFAULT false, "readAt" TIMESTAMP, "deduplicationKey" character varying(100), "userId" uuid NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_NOTIF_DEDUPLICATION" ON "notifications" ("userId", "type", "deduplicationKey") WHERE "deduplicationKey" IS NOT NULL`);
        await queryRunner.query(`CREATE TABLE "notification_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "orderEnabled" boolean NOT NULL DEFAULT true, "promotionEnabled" boolean NOT NULL DEFAULT true, "inappEnabled" boolean NOT NULL DEFAULT true, "emailEnabled" boolean NOT NULL DEFAULT false, "smsEnabled" boolean NOT NULL DEFAULT false, "muteUntil" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "REL_91a7ffebe8b406c4470845d478" UNIQUE ("user_id"), CONSTRAINT "PK_d131abd7996c475ef768d4559ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ADD CONSTRAINT "FK_91a7ffebe8b406c4470845d4781" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_settings" DROP CONSTRAINT "FK_91a7ffebe8b406c4470845d4781"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
        await queryRunner.query(`DROP TABLE "notification_settings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_NOTIF_DEDUPLICATION"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
