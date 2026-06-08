import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThemeSetting1780712661461 implements MigrationInterface {
    name = 'AddThemeSetting1780712661461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "config_type" character varying(100) NOT NULL, "key" character varying(100) NOT NULL, "value" jsonb NOT NULL, "description" character varying, CONSTRAINT "UQ_settings_config_type_key" UNIQUE ("config_type", "key"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_settings_config_type_key" ON "settings" ("config_type", "key") `);
        await queryRunner.query(`CREATE INDEX "IDX_settings_config_type" ON "settings" ("config_type") `);
        await queryRunner.query(`
            INSERT INTO "settings" ("config_type", "key", "value", "description")
            VALUES
                ('brand', 'maps', '["https://maps.app.goo.gl/sbRGbrhpZAT6nqfm7"]'::jsonb, 'Brand map links'),
                ('brand', 'phone', '"0708 018 926"'::jsonb, 'Brand phone number'),
                ('brand', 'owner', '"Võ Đăng Tánh"'::jsonb, 'Brand owner'),
                ('brand', 'email', '"anphatfoods.vn@gmail.com"'::jsonb, 'Brand email'),
                ('brand', 'youtube', '"http://youtube.com/@anphatfoods"'::jsonb, 'Brand YouTube URL'),
                ('brand', 'facebook', '"https://www.facebook.com/anphatvn"'::jsonb, 'Brand Facebook URL'),
                ('brand', 'name', '"Bánh tráng An Phát"'::jsonb, 'Brand name'),
                ('brand', 'subName', '"HTX An Phát"'::jsonb, 'Brand sub name'),
                ('brand', 'address', '"Chu Văn An Xóm 5, thôn Hội Khánh, Xã Phù Mỹ Tây, Gia Lai"'::jsonb, 'Brand address'),
                ('contact', 'phone', '"0708 018 926"'::jsonb, 'Contact phone number'),
                ('contact', 'email', '"anphatfoods.vn@gmail.com"'::jsonb, 'Contact email'),
                ('contact', 'address', '"Chu Văn An Xóm 5, thôn Hội Khánh, Xã Phù Mỹ Tây, Gia Lai"'::jsonb, 'Contact address'),
                ('contact', 'facebook', '"https://www.facebook.com/anphatvn"'::jsonb, 'Contact Facebook URL'),
                ('contact', 'zalo', '"0708 018 926"'::jsonb, 'Contact Zalo'),
                ('contact', 'website', '"https://anphat.io.vn"'::jsonb, 'Contact website'),
                ('contact', 'workingHour', '"08:00 - 17:00"'::jsonb, 'Contact working hours')
            ON CONFLICT ("config_type", "key")
            DO UPDATE SET
                "value" = EXCLUDED."value",
                "description" = EXCLUDED."description",
                "updated_at" = now();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_settings_config_type"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_settings_config_type_key"`);
        await queryRunner.query(`DROP TABLE "settings"`);
    }

}
