import { AppDataSource } from "@/lib/database/typeorm";
import { WarehouseEntity } from "../database/entities";
import { Warehouse } from "@/types";

export async function getAllWarehouses({ page = 1, limit = 20, sortBy = "date", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(WarehouseEntity);
  const qb = repo.createQueryBuilder("warehouse")
    .leftJoinAndSelect("warehouse.warehouseProducts", "wp")
    .leftJoinAndSelect("wp.product", "product")

  // Filtering
  if (filters.status) qb.andWhere("warehouse.status = :status", { status: filters.status });

  // Sorting
  const allowedSortFields = ["createdAt"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  qb.orderBy(`warehouse.${sortField}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getWarehouseById(id: string) {
  const repo = AppDataSource.getRepository(WarehouseEntity);
  const warehouse = await repo.findOne({ where: { id }, relations: ["warehouseProducts", "warehouseProducts.product"] });
  return warehouse;
}

export async function addWarehouse(data: Warehouse) {
  const repo = AppDataSource.getRepository(WarehouseEntity);
  const warehouse = repo.create(data);
  return repo.save(warehouse);
}

export async function updateWarehouse(
  id: string,
  data: Partial<WarehouseEntity> & { customer?: string; items?: string[] }
) {
  if (data.main) {
    const repo = AppDataSource.getRepository(WarehouseEntity);
    const currentMainWH = await repo.findOne({ where: { main: true } });
    if (currentMainWH?.id !== id) {
      await repo.update({ id: currentMainWH?.id }, { main: false });
    }
  }
  const repo = AppDataSource.getRepository(WarehouseEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteWarehouse(id: string) {
  const repo = AppDataSource.getRepository(WarehouseEntity);
  return repo.delete(id);
} 