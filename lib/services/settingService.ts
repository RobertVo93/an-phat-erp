import { AppDataSource } from "@/lib/database/typeorm";
import { SettingEntity } from "@/lib/database/entities";
import type { ISettingFilters } from "@/types/setting.interface";

const SETTING_SORT_COLUMNS = ["configType", "key", "value", "createdAt"] as const;

export async function getSettingsService({
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
    configType,
    key,
    searchTerm,
}: ISettingFilters) {
    const repo = AppDataSource.getRepository(SettingEntity);
    const qb = repo.createQueryBuilder("setting");

    if (configType) qb.andWhere("setting.configType = :configType", { configType });
    if (key) qb.andWhere("setting.key = :key", { key });
    if (searchTerm) {
        qb.andWhere("(setting.key ILIKE :searchTerm OR setting.value::text ILIKE :searchTerm OR setting.description ILIKE :searchTerm)", {
            searchTerm: `%${searchTerm}%`,
        });
    }

    const normalizedSortBy = SETTING_SORT_COLUMNS.includes(sortBy as typeof SETTING_SORT_COLUMNS[number]) ? sortBy : "createdAt";
    const orderColumn = normalizedSortBy === "value" ? "setting.value::text" : `setting.${normalizedSortBy}`;
    qb.orderBy(orderColumn, sortOrder.toUpperCase() as "ASC" | "DESC");
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
}

export async function getSettingsByConfigTypeService(configType: string) {
    const repo = AppDataSource.getRepository(SettingEntity);
    const records = await repo.find({
        where: { configType },
        order: { key: "ASC" },
    });
    if (!records.length) throw new Error("Setting not found");
    return {
        configType,
        records,
        values: records.reduce<Record<string, unknown>>((acc, record) => {
            acc[record.key] = record.value;
            return acc;
        }, {}),
    };
}

export async function updateSettingService(id: string, data: Partial<SettingEntity>) {
    const repo = AppDataSource.getRepository(SettingEntity);
    const setting = await repo.findOneBy({ id });
    if (!setting) throw new Error("Setting not found");

    repo.merge(setting, data);
    return repo.save(setting);
}
