import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettingTable1780410376183 implements MigrationInterface {
    name = 'AddSettingTable1780410376183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF to_regclass('public.settings') IS NULL AND to_regclass('public.contacts') IS NOT NULL THEN
                    ALTER TABLE "contacts" RENAME TO "settings";
                    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UQ_contacts_type') THEN
                        ALTER TABLE "settings" RENAME CONSTRAINT "UQ_contacts_type" TO "UQ_settings_type";
                    END IF;
                    ALTER TABLE "settings" ALTER COLUMN "value" TYPE jsonb USING to_jsonb("value");
                ELSIF to_regclass('public.settings') IS NULL THEN
                    CREATE TABLE "settings" (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                        "created_by" character varying,
                        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                        "updated_by" character varying,
                        "config_type" character varying(100) NOT NULL,
                        "key" character varying(100) NOT NULL,
                        "value" jsonb NOT NULL,
                        "description" character varying,
                        CONSTRAINT "UQ_settings_config_type_key" UNIQUE ("config_type", "key"),
                        CONSTRAINT "PK_settings_id" PRIMARY KEY ("id")
                    );
                END IF;
            END $$;
        `);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'settings' AND column_name = 'type'
                ) AND NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'settings' AND column_name = 'config_type'
                ) THEN
                    CREATE TEMP TABLE settings_grouped AS
                    SELECT
                        uuid_generate_v4() AS id,
                        created_at,
                        created_by,
                        updated_at,
                        updated_by,
                        "type" AS config_type,
                        item.key,
                        item.value,
                        description
                    FROM "settings"
                    CROSS JOIN LATERAL jsonb_each(
                        CASE
                            WHEN jsonb_typeof("settings"."value") = 'object' THEN "settings"."value"
                            ELSE jsonb_build_object('value', "settings"."value")
                        END
                    ) item;

                    DROP TABLE "settings";
                    CREATE TABLE "settings" (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                        "created_by" character varying,
                        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                        "updated_by" character varying,
                        "config_type" character varying(100) NOT NULL,
                        "key" character varying(100) NOT NULL,
                        "value" jsonb NOT NULL,
                        "description" character varying,
                        CONSTRAINT "UQ_settings_config_type_key" UNIQUE ("config_type", "key"),
                        CONSTRAINT "PK_settings_id" PRIMARY KEY ("id")
                    );

                    INSERT INTO "settings" (
                        id,
                        created_at,
                        created_by,
                        updated_at,
                        updated_by,
                        config_type,
                        "key",
                        value,
                        description
                    )
                    SELECT
                        id,
                        created_at,
                        created_by,
                        updated_at,
                        updated_by,
                        config_type,
                        "key",
                        value,
                        description
                    FROM settings_grouped;

                    DROP TABLE settings_grouped;
                END IF;

                CREATE INDEX IF NOT EXISTS "IDX_settings_config_type" ON "settings" ("config_type");
                CREATE INDEX IF NOT EXISTS "IDX_settings_config_type_key" ON "settings" ("config_type", "key");
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF to_regclass('public.contacts') IS NULL AND to_regclass('public.settings') IS NOT NULL THEN
                    CREATE TEMP TABLE settings_legacy AS
                    SELECT
                        uuid_generate_v4() AS id,
                        MIN(created_at) AS created_at,
                        MIN(created_by) AS created_by,
                        MAX(updated_at) AS updated_at,
                        MAX(updated_by) AS updated_by,
                        config_type AS "type",
                        jsonb_object_agg("key", value) AS value,
                        MIN(description) AS description
                    FROM "settings"
                    GROUP BY config_type;

                    DROP TABLE "settings";
                    CREATE TABLE "contacts" (
                        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                        "created_by" character varying,
                        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                        "updated_by" character varying,
                        "type" character varying(100) NOT NULL,
                        "value" text NOT NULL,
                        "description" character varying,
                        CONSTRAINT "UQ_contacts_type" UNIQUE ("type"),
                        CONSTRAINT "PK_settings_id" PRIMARY KEY ("id")
                    );

                    INSERT INTO "contacts" (
                        id,
                        created_at,
                        created_by,
                        updated_at,
                        updated_by,
                        "type",
                        value,
                        description
                    )
                    SELECT
                        id,
                        created_at,
                        created_by,
                        updated_at,
                        updated_by,
                        "type",
                        value::text,
                        description
                    FROM settings_legacy;

                    DROP TABLE settings_legacy;
                END IF;
            END $$;
        `);
    }

}
