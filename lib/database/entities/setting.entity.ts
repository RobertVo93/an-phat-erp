import { Entity, Column, Index, Unique } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";

@Entity({ name: "settings" })
@Unique("UQ_settings_config_type_key", ["configType", "key"])
@Index("IDX_settings_config_type", ["configType"])
@Index("IDX_settings_config_type_key", ["configType", "key"])
export class SettingEntity extends BaseEntity {
    @Column({ name: "config_type", type: "varchar", length: 100 })
    configType!: string;

    @Column({ type: "varchar", length: 100 })
    key!: string;

    @Column({ type: "jsonb", nullable: false })
    value!: unknown;

    @Column({ nullable: true })
    description?: string;
}
