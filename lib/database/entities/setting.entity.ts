import { Entity, Column, Index, Unique } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { ISetting } from "@/types/setting.interface";
import type { SettingConfigType, SettingKey, SettingValue } from "@/types/setting.interface";

@Entity({ name: "settings" })
@Unique("UQ_settings_config_type_key", ["configType", "key"])
@Index("IDX_settings_config_type", ["configType"])
@Index("IDX_settings_config_type_key", ["configType", "key"])
export class SettingEntity extends BaseEntity implements ISetting {
    @Column({ name: "config_type", type: "varchar", length: 100, nullable: false })
    configType?: SettingConfigType;

    @Column({ type: "varchar", length: 100, nullable: false })
    key?: SettingKey;

    @Column({ type: "jsonb", nullable: false })
    value?: SettingValue;

    @Column({ nullable: true })
    description?: string;
}
