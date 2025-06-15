import { AppDataSource } from "@/lib/database/typeorm";
import { ProductEntity, StockChangeEntity, WarehouseEntity } from "../database/entities";
import { Product, StockChange, StockChangeStatus, StockChangeType } from "@/types";
import { WarehouseProductEntity } from "../database/entities/warehouse-product.entity";
import { StockProductEntity } from "../database/entities/stock-product.entity";
import { StockProduct } from "@/types/stock-product";

export async function getAllStockChanges() {
  const repo = AppDataSource.getRepository(StockChangeEntity);
  const qb = repo
    .createQueryBuilder("stockChange")
    .leftJoinAndSelect("stockChange.warehouse", "warehouse")
    .leftJoinAndSelect("stockChange.stockProducts", "stockProducts")
    .leftJoinAndSelect("stockProducts.product", "product")

  const [data] = await qb.getManyAndCount();
  return { data };
}

export async function addStockChange(data: StockChange, stockProducts: StockProduct[]) {
  const stockChangeRepo = AppDataSource.getRepository(StockChangeEntity);
  const stockProductRepo = AppDataSource.getRepository(StockProductEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const warehouseProductRepo = AppDataSource.getRepository(WarehouseProductEntity);
  const warehouseRepo = AppDataSource.getRepository(WarehouseEntity);

  // STEP 1: create stock change record
  const stockChange = stockChangeRepo.create(data);
  const added = await stockChangeRepo.save(stockChange);

  const stockProductEntities: StockProductEntity[] = [];
  const warehouseProductEntities: WarehouseProductEntity[] = [];
  const updatedProducts: Product[] = [];

  for (const item of stockProducts) {
    const product = await productRepo.findOneByOrFail({ id: item.product?.id! });

    // STEP 2: create stock_product records
    const stockProduct = stockProductRepo.create({
      stockChange,
      product,
      unitCost: item.unitCost,
      quantity: item.quantity,
      totalCost: item.totalCost,
    });
    stockProductEntities.push(stockProduct);

    if (data.status === StockChangeStatus.completed) {
      const warehouse = data.warehouse?.id
        ? await warehouseRepo.findOneByOrFail({ id: data.warehouse.id })
        : undefined;

      // STEP 3: update product total stock
      product.stock = (product.stock ?? 0) + (data.type === StockChangeType.stockIn ? item.quantity! : -item.quantity!);
      updatedProducts.push(product);

      // STEP 4: create warehouse_product records
      const warehouseProduct = warehouseProductRepo.create({
        product,
        warehouse,
        quantity: data.type === StockChangeType.stockIn ? item.quantity! : -item.quantity!
      });
      warehouseProductEntities.push(warehouseProduct);
    }
  }

  await stockProductRepo.save(stockProductEntities);
  await warehouseProductRepo.save(warehouseProductEntities);
  await productRepo.save(updatedProducts);

  const addedFullInformation = await stockChangeRepo.findOne({
    where: { id: added.id },
    relations: {
      warehouse: true,
      stockProducts: {
        product: true,
      },
    },
  });
  return addedFullInformation;
}

export async function updateStockChange(id: string, data: StockChange, stockProducts: StockProduct[]) {
  const stockChangeRepo = AppDataSource.getRepository(StockChangeEntity);
  const stockProductRepo = AppDataSource.getRepository(StockProductEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const warehouseProductRepo = AppDataSource.getRepository(WarehouseProductEntity);
  const warehouseRepo = AppDataSource.getRepository(WarehouseEntity);

  // STEP 1: update stock change records
  const existing = await stockChangeRepo.findOneByOrFail({ id });
  const merged = stockChangeRepo.merge(existing, data);
  const updated = await stockChangeRepo.save(merged);

  // STEP 2: remove all previous stock_products records
  await stockProductRepo.delete({ stockChange: { id } });

  const stockProductEntities: StockProductEntity[] = [];
  const warehouseProductEntities: WarehouseProductEntity[] = [];
  const updatedProducts: Product[] = [];
  for (const item of stockProducts) {
    const product = await productRepo.findOneByOrFail({ id: item.product?.id });

    // STEP 3: udpate stock_product records
    const stockProduct = stockProductRepo.create({
      stockChange: updated,
      product,
      unitCost: item.unitCost,
      quantity: item.quantity,
      totalCost: item.totalCost,
    });
    stockProductEntities.push(stockProduct);

    if (data.status === StockChangeStatus.completed) {
      const warehouse = data.warehouse?.id
        ? await warehouseRepo.findOneByOrFail({ id: data.warehouse.id })
        : undefined;

      // STEP 4: update product total stock
      product.stock = (product.stock ?? 0) + (data.type === StockChangeType.stockIn ? item.quantity! : -item.quantity!);
      updatedProducts.push(product);

      // STEP 5: create warehouse_product records
      const warehouseProduct = warehouseProductRepo.create({
        product,
        warehouse,
        quantity: item.quantity
      });
      warehouseProductEntities.push(warehouseProduct);
    }
  }

  await stockProductRepo.save(stockProductEntities);
  await warehouseProductRepo.save(warehouseProductEntities);
  await productRepo.save(updatedProducts);
  
  const updatedFullInformation = await stockChangeRepo.findOne({
    where: { id: updated.id },
    relations: {
      warehouse: true,
      stockProducts: {
        product: true,
      },
    },
  });

  return updatedFullInformation;
}

export async function deleteStockChange(id: string) {
  const repo = AppDataSource.getRepository(StockChangeEntity);
  const stockProductRepo = AppDataSource.getRepository(StockProductEntity);

  // remove all previous stock_products records
  await stockProductRepo.delete({ stockChange: { id } });

  return repo.delete(id);
} 