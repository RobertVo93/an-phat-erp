import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDefaultBrandSettings1780502400000 implements MigrationInterface {
    name = "SeedDefaultBrandSettings1780502400000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "settings" ("config_type", "key", "value", "description")
            VALUES
                ('brand', 'maps', '["https://maps.app.goo.gl/ujruoCsN4dCWMNCc6"]'::jsonb, 'Brand map links'),
                ('brand', 'phone', '"0338705850"'::jsonb, 'Brand phone number'),
                ('brand', 'owner', '"Võ Hoàng An"'::jsonb, 'Brand owner'),
                ('brand', 'email', '"vohoangankl93@gmail.com"'::jsonb, 'Brand email'),
                ('brand', 'youtube', '"https://www.youtube.com/@robertvo1873"'::jsonb, 'Brand YouTube URL'),
                ('brand', 'facebook', '"https://www.facebook.com/acebakeryvn"'::jsonb, 'Brand Facebook URL'),
                ('brand', 'name', '"An Phat Food"'::jsonb, 'Brand name'),
                ('brand', 'subName', '"HTX Phù Mỹ"'::jsonb, 'Brand sub name'),
                ('brand', 'address', '"Chu Văn An Xóm 5, thôn Hội Khánh, Xã, Phù Mỹ, Bình Định"'::jsonb, 'Brand address')
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
            WHERE "config_type" = 'brand'
                AND "key" IN (
                    'maps',
                    'phone',
                    'owner',
                    'email',
                    'youtube',
                    'facebook',
                    'name',
                    'subName',
                    'address'
                );
        `);
    }
}
