import { AppDataSource } from "@/lib/database/typeorm";
import { IProductionElement, ProductionRecord as IProductionRecord } from "@/types/production";
import { ProductionRecordEntity } from "@/lib/database/entities/production-record.entity";
import { ProductEntity } from "@/lib/database/entities/product.entity";
import { StockChangeEntity } from "@/lib/database/entities/stock-change.entity";
import { WarehouseEntity } from "@/lib/database/entities/warehouse.entity";
import { CommonService } from "@/lib/services/commonService";
import { IStockProduct, StockChangeStatus, StockChangeType } from "@/types";
import { startOfDay, endOfDay } from "date-fns";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getAllProductionRecords({ page = 1, limit = 20, sortBy = "date", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(ProductionRecordEntity);
  const qb = repo
    .createQueryBuilder("productionRecord")
    .leftJoinAndSelect("productionRecord.pic", "pic")
    .leftJoinAndSelect("productionRecord.product", "product")
    .leftJoinAndSelect("productionRecord.warehouse", "warehouse")

  // Filtering
  if (filters.status) qb.andWhere("productionRecord.status = :status", { status: filters.status });
  if (filters.dateFrom) {
    const start = startOfDay(filters.dateFrom);
    qb.andWhere("productionRecord.date >= :dateFrom", { dateFrom: start });
  }
  if (filters.dateTo) {
    const end = endOfDay(filters.dateTo);
    qb.andWhere("productionRecord.date <= :dateTo", { dateTo: end });
  }
  if (filters.product) qb.andWhere("product.id = :product", { product: filters.product });
  if (filters.searchTerm) qb.andWhere("(productionRecord.number ILIKE :searchTerm OR productionRecord.notes ILIKE :searchTerm)", { searchTerm: `%${filters.searchTerm}%` });

  // Sorting
  const allowedSortFields = ["date", "number", "status"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "date";
  qb.orderBy(`productionRecord.${sortField}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getTodayProductions() {
  const repo = AppDataSource.getRepository(ProductionRecordEntity);

  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  const qb = repo
    .createQueryBuilder("productionRecord")
    .leftJoinAndSelect("productionRecord.pic", "pic")
    .leftJoinAndSelect("productionRecord.product", "product")
    .leftJoinAndSelect("productionRecord.warehouse", "warehouse")
    .where("productionRecord.date BETWEEN :start AND :end", { start, end })
    .orderBy("productionRecord.date", "DESC");

  const data = await qb.getMany();

  return data
}

export async function getProductionByIdOrNumber(idOrNumber: string): Promise<IProductionRecord | null> {
  const repo = AppDataSource.getRepository(ProductionRecordEntity);
  const where = UUID_PATTERN.test(idOrNumber)
    ? [{ id: idOrNumber }, { number: idOrNumber }]
    : [{ number: idOrNumber }];

  return repo.findOne({
    where,
    relations: ["pic", "product", "warehouse"],
  });
}

export async function createProductionRecord(
  data: Partial<IProductionRecord>,
  productionMaterials: IProductionElement[],
  productionUtilities: IProductionElement[],
  parseProductionLabors: IProductionElement[]
): Promise<IProductionRecord | null> {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const productionRecord = productionRecordRepo.create({
    ...data,
    materials: productionMaterials,
    utilities: productionUtilities,
    labors: parseProductionLabors,
  });
  const savedProductionRecord = await productionRecordRepo.save(productionRecord);
  return savedProductionRecord;
}

export async function updateProduction(
  id: string,
  data: Partial<IProductionRecord>,
  productionMaterials: IProductionElement[],
  productionUtilities: IProductionElement[],
  parseProductionLabors: IProductionElement[]
) {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const existingRecord = await productionRecordRepo.findOne({ where: { id } });
  if (!existingRecord) throw new Error("ProductionRecord not found");

  productionRecordRepo.merge(existingRecord, {
    ...data,
    materials: productionMaterials,
    utilities: productionUtilities,
    labors: parseProductionLabors,
  });
  await productionRecordRepo.save(existingRecord);
  return {
    ...existingRecord,
    ...data,
    materials: productionMaterials,
    utilities: productionUtilities,
    labors: parseProductionLabors,
  };
}

export async function deleteProduction(id: string): Promise<boolean> {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const record = await productionRecordRepo.findOne({ where: { id } });
  if (!record) throw new Error("Production record not found.");
  await productionRecordRepo.remove(record);
  return true;
}

export async function handleStatusCompleted(record: ProductionRecordEntity) {
  await AppDataSource.transaction(async (manager) => {
    const stockChangeRepo = manager.getRepository(StockChangeEntity);
    const productRepo = manager.getRepository(ProductEntity);
    const warehouseRepo = manager.getRepository(WarehouseEntity);
    const warehouse = await warehouseRepo.findOne({ where: { id: record.warehouse?.id } });
    const commonService = new CommonService();
    const stockChangeNumber = await commonService.getEntityNumber(StockChangeEntity, "STC");

    // 1. StockIn for finished product
    if (record.product && record.warehouse) {
      // Find the product and warehouse entities
      const product = await productRepo.findOne({ where: { id: record.product.id } });

      if (product && warehouse) {
        // Create stock change for finished product (StockIn)
        const stockIn = stockChangeRepo.create({
          number: stockChangeNumber,
          type: StockChangeType.stockIn,
          date: new Date(),
          supplier: `${record.number}`,
          subtotal: record.totalCost ?? 0,
          tax: 0,
          discount: 0,
          totalAmount: record.totalCost ?? 0,
          status: StockChangeStatus.completed,
          notes: `${record.number}`,
          stockProducts: [
            {
              id: product.id,
              sku: product.sku,
              name: product.name,
              quantity: record.quantity ?? 1,
              unit: product.unit,
              unitCost: product.price,
              totalCost: record.totalCost ?? 0,
            }
          ],
          receivedBy: "System",
          warehouse: warehouse,
          productionRecord: record,
        });
        await stockChangeRepo.save(stockIn);
      }
    }

    // 2. StockOut for materials
    if (record.materials && record.materials.length > 0 && record.warehouse) {
      const stockProducts: IStockProduct[] = [];
      for (const material of record.materials) {
        if (material.id) {
          const prod = await productRepo.findOne({ where: { id: material.id } });
          if (prod) {
            stockProducts.push({
              id: prod.id,
              sku: prod.sku,
              name: prod.name,
              quantity: material.quantity ?? 1,
              unit: prod.unit,
              unitCost: prod.cost,
              totalCost: material.totalCost ?? 0,
            });
          }
        }
      }
      if (stockProducts.length > 0 && warehouse) {
        const stockOut = stockChangeRepo.create({
          number: await commonService.getEntityNumber(StockChangeEntity, "STC", stockChangeNumber),
          type: StockChangeType.stockOut,
          date: new Date(),
          supplier: `${record.number}`,
          subtotal: stockProducts?.reduce((acc, curr) => acc + (curr.totalCost ?? 0), 0) ?? 0,
          tax: 0,
          discount: 0,
          totalAmount: stockProducts?.reduce((acc, curr) => acc + (curr.totalCost ?? 0), 0) ?? 0,
          status: StockChangeStatus.completed,
          notes: `${record.number}`,
          stockProducts: stockProducts,
          receivedBy: "System",
          warehouse: warehouse,
          productionRecord: record,
        });
        await stockChangeRepo.save(stockOut);
      }
    }
  });
}
