import { AppDataSource } from "@/lib/database/typeorm";
import { Utility, UtilityFilters } from "@/types";
import { UtilityEntity } from "../database/entities";

export async function getUtilities(filters: UtilityFilters) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  const qb = repo.createQueryBuilder("utility");

  // Correct filtering logic
  if (filters.type) qb.andWhere("utility.type = :type", { type: filters.type });
  if (filters.status) qb.andWhere("utility.status = :status", { status: filters.status });
  if (filters.location) qb.andWhere("utility.location = :location", { location: filters.location });
  if (filters.provider) qb.andWhere("utility.provider = :provider", { provider: filters.provider });

  if (filters.dueDateFrom) qb.andWhere("utility.dueDate >= :dueDateFrom", { dueDateFrom: filters.dueDateFrom });
  if (filters.dueDateTo) qb.andWhere("utility.dueDate <= :dueDateTo", { dueDateTo: filters.dueDateTo });

  if (filters.costFrom) qb.andWhere("utility.monthlyCost >= :costFrom", { costFrom: filters.costFrom });
  if (filters.costTo) qb.andWhere("utility.monthlyCost <= :costTo", { costTo: filters.costTo });

  if (filters.searchTerm) {
    qb.andWhere(
      `(
      utility.location ILIKE :search OR
      utility.provider ILIKE :search OR
      utility.accountNumber ILIKE :search
    )`,
      { search: `%${filters.searchTerm}%` }
    );
  }

  // Sorting
  qb.orderBy(`utility.${filters.sortField}`, filters.sortDirection!.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((filters.page! - 1) * filters.limit!).take(filters.limit!);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page: filters.page, limit: filters.limit };
}

export async function addUtility(data: Utility) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  const added = repo.create(data);
  return repo.save(added);
}

export async function updateUtility(
  id: string,
  data: Partial<Utility>
) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteUtility(id: string) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  return repo.delete(id);
} 