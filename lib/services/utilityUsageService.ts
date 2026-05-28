import { AppDataSource } from "@/lib/database/typeorm";
import { UtilityUsageEntity } from "@/lib/database/entities";
import type { IUtilityUsage, IUtilityUsageFilters } from "@/types";
import { startOfDay, endOfDay } from "date-fns";

export async function getUtilityUsagesService({
  page = 1,
  limit = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
  filters = {} as IUtilityUsageFilters,
}) {
  const repo = AppDataSource.getRepository(UtilityUsageEntity);
  const qb = repo
    .createQueryBuilder("utilityUsage")
    .leftJoinAndSelect("utilityUsage.utility", "utility")
    .leftJoinAndSelect("utilityUsage.recorder", "recorder")
    .leftJoinAndSelect("utilityUsage.approver", "approver");

  if (filters.status) qb.andWhere("utilityUsage.status = :status", { status: filters.status });
  if (filters.utilityId) qb.andWhere("utility.id = :utilityId", { utilityId: filters.utilityId });
  if (filters.recorderId) qb.andWhere("recorder.id = :recorderId", { recorderId: filters.recorderId });
  if (filters.approverId) qb.andWhere("approver.id = :approverId", { approverId: filters.approverId });
  if (filters.periodStart) {
    const start = startOfDay(filters.periodStart);
    qb.andWhere("utilityUsage.usageTime >= :periodStart", { periodStart: start });
  }
  if (filters.periodEnd) {
    const end = endOfDay(filters.periodEnd);
    qb.andWhere("utilityUsage.usageTime <= :periodEnd", { periodEnd: end });
  }
  if (filters.searchTerm) {
    qb.andWhere(
      "(utilityUsage.number ILIKE :searchTerm OR utilityUsage.note ILIKE :searchTerm OR utility.name ILIKE :searchTerm)",
      { searchTerm: `%${filters.searchTerm}%` }
    );
  }

  qb.orderBy(`utilityUsage.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getUtilityUsageByIdOrNumberService(idOrNumber: string) {
  const repo = AppDataSource.getRepository(UtilityUsageEntity);
  return repo.findOne({
    where: [{ id: idOrNumber }, { number: idOrNumber }],
    relations: {
      utility: true,
      recorder: true,
      approver: true,
    },
  });
}

export async function addUtilityUsageService(data: IUtilityUsage) {
  const repo = AppDataSource.getRepository(UtilityUsageEntity);
  const added = repo.create(data);
  return repo.save(added);
}

export async function updateUtilityUsageService(id: string, data: Partial<IUtilityUsage>) {
  const repo = AppDataSource.getRepository(UtilityUsageEntity);
  const record = await repo.findOneBy({ id });
  if (!record) throw new Error("Utility usage not found");
  repo.merge(record, data);
  return repo.save(record);
}

export async function deleteUtilityUsageService(id: string) {
  const repo = AppDataSource.getRepository(UtilityUsageEntity);
  const record = await repo.findOneBy({ id });
  if (!record) throw new Error("Utility usage not found");
  await repo.remove(record);
  return true;
}
