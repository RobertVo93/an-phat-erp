import { AppDataSource } from "@/lib/database/typeorm";
import { CollectionEntity } from "@/lib/database/entities/collection.entity";

export async function getAllCollections({
  page = 1,
  limit = 20,
  sortBy = "created_at",
  sortOrder = "desc",
  filters = {} as Record<string, any>,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: {
    name?: string;
    status?: string;
    category?: string;
    search?: string;
  };
} = {}) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  const qb = repo.createQueryBuilder("collection");

  // Filtering
  if (filters.name) qb.andWhere("collection.name ILIKE :name", { name: `%${filters.name}%` });
  if (filters.status) qb.andWhere("collection.status = :status", { status: filters.status });
  if (filters.category) qb.andWhere("collection.category = :category", { category: filters.category });
  if (filters.search) {
    qb.andWhere(
      "(collection.name ILIKE :search OR collection.description ILIKE :search)",
      { search: `%${filters.search}%` }
    );
  }

  // Sorting
  qb.orderBy(`collection.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getCollectionById(id: string) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  return repo.findOneBy({ id });
}

export async function createCollection(data: Partial<CollectionEntity>) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  const collection = repo.create(data);
  return repo.save(collection);
}

export async function updateCollection(id: string, data: Partial<CollectionEntity>) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteCollection(id: string) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  return repo.delete(id);
} 