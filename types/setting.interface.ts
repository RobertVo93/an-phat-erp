import { IBaseFilters } from "./base.interface";

export type SettingConfigType = string;
export type SettingKey = string;
export type SettingValue = unknown;

export interface Setting {
    id?: string;
    configType?: SettingConfigType;
    key?: SettingKey;
    value: SettingValue;
    description?: string;
    createdAt?: Date | string;
    createdBy?: string;
    updatedAt?: Date | string;
    updatedBy?: string;
}

export interface SettingFilters extends IBaseFilters {
    configType?: SettingConfigType;
    key?: SettingKey;
    searchTerm?: string;
}
