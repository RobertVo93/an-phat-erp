import { AppDataSource } from "@/lib/database/typeorm";
import { In } from "typeorm";
import { WarehouseEntity } from "../database/entities";
import { Warehouse } from "@/types";

export async function getAllWarehouses() {
  const repo = AppDataSource.getRepository(WarehouseEntity);
  const qb = repo.createQueryBuilder("warehouse")
    .leftJoinAndSelect("warehouse.warehouseProducts", "wp")
    .leftJoinAndSelect("wp.product", "product")
    .orderBy("warehouse.name", "ASC");

  const [data] = await qb.getManyAndCount();
  return { data };
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