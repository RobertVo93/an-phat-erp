import { AppDataSource } from "@/lib/database/typeorm";
import { Utility, UtilityFilters } from "@/types";
import { UtilityEntity } from "@/lib/database/entities/utility.entity";

export async function getUtilitiesService({ page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", filters = {} as UtilityFilters }) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  const qb = repo.createQueryBuilder("utility");

  if (filters.status) qb.andWhere("utility.status = :status", { status: filters.status });
  if (filters.costFrom) qb.andWhere("utility.costPerUnit >= :costFrom", { costFrom: filters.costFrom });
  if (filters.costTo) qb.andWhere("utility.costPerUnit <= :costTo", { costTo: filters.costTo });
  if (filters.searchTerm) qb.andWhere("(utility.number ILIKE :searchTerm OR utility.name ILIKE :searchTerm OR utility.provider ILIKE :searchTerm OR utility.location ILIKE :searchTerm)", { searchTerm: `%${filters.searchTerm}%` });

  qb.orderBy(`utility.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function addUtilityService(data: Utility) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  const added = repo.create(data);
  return repo.save(added);
}

export async function updateUtilityService(
  id: string,
  data: Partial<Utility>
) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  const record = await repo.findOneBy({ id });
  if (!record) throw new Error("Utility not found");
  repo.merge(record, data);
  return await repo.save(record);
}

export async function deleteUtilityService(id: string) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  const record = await repo.findOneBy({ id });
  if (!record) throw new Error("Utility not found");
  await repo.remove(record);
  return true;
} 
