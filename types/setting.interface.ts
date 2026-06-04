import { IBase, IBaseFilters } from "./base.interface";
import type { SettingConfigType, SettingKey, SettingValue } from "./setting-definition";

export type {
    SettingConfigType,
    SettingKey,
    SettingValue,
} from "./setting-definition";

export interface Setting extends IBase{
    configType?: SettingConfigType;
    key?: SettingKey;
    value: SettingValue;
    description?: string;
}

export interface SettingFilters extends IBaseFilters {
    configType?: SettingConfigType;
    key?: SettingKey;
    searchTerm?: string;
}
