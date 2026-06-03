import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDefaultContactSettings1780502500000 implements MigrationInterface {
    name = "SeedDefaultContactSettings1780502500000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "settings" ("config_type", "key", "value", "description")
            VALUES
                ('contact', 'phone', '"0338705850"'::jsonb, 'Contact phone number'),
                ('contact', 'email', '"vohoangankl93@gmail.com"'::jsonb, 'Contact email'),
                ('contact', 'address', '"Chu Văn An Xóm 5, thôn Hội Khánh, Xã, Phù Mỹ, Bình Định"'::jsonb, 'Contact address'),
                ('contact', 'facebook', '"https://www.facebook.com/acebakeryvn"'::jsonb, 'Contact Facebook URL'),
                ('contact', 'zalo', '"0338705850"'::jsonb, 'Contact Zalo'),
                ('contact', 'website', '"https://www.facebook.com/acebakeryvn"'::jsonb, 'Contact website'),
                ('contact', 'workingHour', '"08:00 - 17:00"'::jsonb, 'Contact working hours')
            ON CONFLICT ("config_type", "key")
            DO UPDATE SET
                "value" = EXCLUDED."value",
                "description" = EXCLUDED."description",
                "updated_at" = now();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "settings"
            WHERE "config_type" = 'contact'
                AND "key" IN (
                    'phone',
                    'email',
                    'address',
                    'facebook',
                    'zalo',
                    'website',
                    'workingHour'
                );
        `);
    }
}
