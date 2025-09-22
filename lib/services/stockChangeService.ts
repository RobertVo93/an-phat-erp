import { AppDataSource } from "@/lib/database/typeorm";
import { ProductEntity, StockChangeEntity, UserEntity } from "@/lib/database/entities";
import { StockChange, StockChangeStatus, StockChangeType } from "@/types";
import { IStockProduct } from "@/types/stock-change";
import { CommonService } from "@/lib/services/commonService";

export async function getAllStockChanges({ page = 1, limit = 20, sortBy = "date", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(StockChangeEntity);
  const qb = repo
    .createQueryBuilder("stockChange")
    .leftJoinAndSelect("stockChange.warehouse", "warehouse")

  // Filtering
  if (filters.status) qb.andWhere("stockChange.status = :status", { status: filters.status });
  if (filters.dateFrom) qb.andWhere("stockChange.date >= :dateFrom", { dateFrom: filters.dateFrom });
  if (filters.dateTo) qb.andWhere("stockChange.date <= :dateTo", { dateTo: filters.dateTo });
  if (filters.supplier) qb.andWhere("stockChange.supplier = :supplier", { supplier: filters.supplier });
  if (filters.amountFrom) qb.andWhere("stockChange.totalAmount >= :amountFrom", { amountFrom: filters.amountFrom });
  if (filters.amountTo) qb.andWhere("stockChange.totalAmount <= :amountTo", { amountTo: filters.amountTo });
  if (filters.searchTerm) qb.andWhere("(stockChange.number ILIKE :searchTerm OR stockChange.notes ILIKE :searchTerm or stockChange.receivedBy ILIKE :searchTerm)", { searchTerm: `%${filters.searchTerm}%` });
  if (filters.warehouse) qb.andWhere("warehouse.name = :warehouse", { warehouse: filters.warehouse });

  // Sorting
  const allowedSortFields = ["date", "supplier", "totalAmount", "status"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "date";
  qb.orderBy(`stockChange.${sortField}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
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

export async function transferWarehouse(
  sourceWarehouseId: string,
  destinationWarehouseId: string,
  productId: string,
  quantity: number,
  userId: string,
) {
  return await AppDataSource.transaction(async (manager) => {
    const repo = manager.getRepository(StockChangeEntity);
    const userRepo = manager.getRepository(UserEntity);
    const productRepo = manager.getRepository(ProductEntity);
    const commonService = new CommonService();
    const stockChangeNumber = await commonService.getEntityNumber("StockChangeEntity", "STC");

    const user = await userRepo.findOneOrFail({
      where: { id: userId },
      select: ["id", "username"],
    });

    const product = await productRepo.findOneOrFail({
      where: { id: productId },
    });

    const unitCost = product.cost || 0;
    const totalCost = unitCost * quantity;

    const stockProducts: IStockProduct[] = [
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        unit: product.unit,
        unitCost,
        quantity,
        totalCost,
      },
    ];

    const subtotal = totalCost;
    const tax = 0;
    const discount = 0;
    const totalAmount = subtotal + tax - discount;

    // 1. Stock Out (source)
    const stockOut = repo.create({
      number: stockChangeNumber,
      type: StockChangeType.stockOut,
      status: StockChangeStatus.completed,
      warehouse: { id: sourceWarehouseId },
      stockProducts,
      date: new Date(),
      subtotal,
      tax,
      discount,
      totalAmount,
      receivedBy: user.username,
      notes: `Stock out from ${sourceWarehouseId} to ${destinationWarehouseId}`,
      receivedDate: new Date(),
    });
    await repo.save(stockOut);

    // 2. Stock In (destination)
    const stockIn = repo.create({
      number: await commonService.getEntityNumber("StockChangeEntity", "STC", stockChangeNumber),
      type: StockChangeType.stockIn,
      status: StockChangeStatus.completed,
      warehouse: { id: destinationWarehouseId },
      stockProducts,
      date: new Date(),
      subtotal,
      tax,
      discount,
      totalAmount,
      receivedBy: user.username,
      notes: `Stock in from ${sourceWarehouseId} to ${destinationWarehouseId}`,
      receivedDate: new Date(),
    });
    await repo.save(stockIn);

    return { stockOut, stockIn };
  });
}