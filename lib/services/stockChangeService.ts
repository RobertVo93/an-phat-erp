import { AppDataSource } from "@/lib/database/typeorm";
import { StockChangeEntity } from "@/lib/database/entities";
import { StockChange } from "@/types";
import { IStockProduct } from "@/types/stock-change";

export async function getAllStockChanges(): Promise<{ data: StockChange[] }> {
  const repo = AppDataSource.getRepository(StockChangeEntity);
  const qb = repo
    .createQueryBuilder("stockChange")
    .leftJoinAndSelect("stockChange.warehouse", "warehouse")

  const [data] = await qb.getManyAndCount();
  return { data };
}

export async function addStockChange(data: StockChange, stockProducts: IStockProduct[]): Promise<StockChange> {
  const stockChangeRepo = AppDataSource.getRepository(StockChangeEntity);
  const stockChange = stockChangeRepo.create({ ...data, stockProducts: stockProducts });
  const added = await stockChangeRepo.save(stockChange);
  return added;
}

export async function updateStockChange(id: string, data: StockChange, stockProducts: IStockProduct[]): Promise<StockChange> {
  const stockChangeRepo = AppDataSource.getRepository(StockChangeEntity);
  const existing = await stockChangeRepo.findOneByOrFail({ id });
  const merged = stockChangeRepo.merge(existing, {
    ...data,
    stockProducts: stockProducts
  });
  const updated = await stockChangeRepo.save(merged);
  return updated;
}

export async function deleteStockChange(id: string): Promise<boolean> {
  const repo = AppDataSource.getRepository(StockChangeEntity);
  const deletedRecord = await repo.findOne({ where: { id } });
  if (!deletedRecord) throw new Error("Stock change not found");
  await repo.remove(deletedRecord);
  return true;
}