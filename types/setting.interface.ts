import { IBase, IBaseFilters } from "./base.interface";
import type { SettingConfigType, SettingKey, SettingValue } from "./setting-definition";

export type {
    SettingConfigType,
    SettingKey,
    SettingValue,
} from "./setting-definition";

export interface ISetting extends IBase{
    configType?: SettingConfigType;
    key?: SettingKey;
    value?: SettingValue;
    description?: string;
}

export interface ISettingFilters extends IBaseFilters {
    configType?: SettingConfigType;
    key?: SettingKey;
    searchTerm?: string;
}
