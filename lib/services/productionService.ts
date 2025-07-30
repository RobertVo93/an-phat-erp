import { AppDataSource } from "@/lib/database/typeorm";
import { ProductionRecord } from "@/types/production";
import { ProductionRecordEntity } from "../database/entities/production-record.entity";
import { ProductionMaterial } from "@/types/productionMaterial";
import { ProductionMaterialEntity } from "../database/entities/production-material.entity";
import { EmployeeEntity, ProductEntity, StockChangeEntity, UtilityEntity, WarehouseEntity } from "../database/entities";
import { ProductionUtility } from "@/types/productionUtility";
import { ProductionUtilityEntity } from "../database/entities/production-utility.entity";
import { ProductionLabor } from "@/types/ProductionLabor";
import { ProductionLaborEntity } from "../database/entities/production-labor.entity";
import { ProductionStatus, StockChangeStatus, StockChangeType } from "@/types";
import { Not } from "typeorm";
import { WarehouseProductEntity } from "../database/entities/warehouse-product.entity";
import { StockProductEntity } from "../database/entities/stock-product.entity";

export async function getAllProductionRecords() {
  const repo = AppDataSource.getRepository(ProductionRecordEntity);
  const qb = repo
    .createQueryBuilder("productionRecord")
    .leftJoinAndSelect("productionRecord.product", "product")
    .leftJoinAndSelect("productionRecord.productionMaterials", "productionMaterials")
    .leftJoinAndSelect("productionMaterials.material", "material")
    .leftJoinAndSelect("productionRecord.productionUtilities", "productionUtilities")
    .leftJoinAndSelect("productionUtilities.utility", "utility")
    .leftJoinAndSelect("productionRecord.productionLabors", "productionLabors")
    .leftJoinAndSelect("productionLabors.employee", "employee")
    .leftJoinAndSelect("productionRecord.warehouse", "warehouse")
    .leftJoinAndSelect("warehouse.warehouseProducts", "warehouseProducts")
    .leftJoinAndSelect("warehouseProducts.product", "wpProduct");

  const [data] = await qb.getManyAndCount();
  return { data };
}

export async function createProductionRecord(
  data: Partial<ProductionRecord>,
  productionMaterials: ProductionMaterial[],
  productionUtilities: ProductionUtility[],
  parseProductionLabors: ProductionLabor[]
) {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const productionMaterialRepo = AppDataSource.getRepository(ProductionMaterialEntity);
  const productionUtilityRepo = AppDataSource.getRepository(ProductionUtilityEntity);
  const productionLaborRepo = AppDataSource.getRepository(ProductionLaborEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const utilityRepo = AppDataSource.getRepository(UtilityEntity);
  const employeeRepo = AppDataSource.getRepository(EmployeeEntity);

  const productionRecord = productionRecordRepo.create(data);
  const savedProductionRecord = await productionRecordRepo.save(productionRecord);

  // 1. Create materials
  const productionMaterialList: ProductionMaterialEntity[] = [];
  for (const item of productionMaterials) {
    if (!item.material?.id) continue;

    const material = await productRepo.findOneBy({ id: item.material.id });
    if (!material) continue;

    const productionMaterial = productionMaterialRepo.create({
      quantity: item.quantity ?? 0,
      totalCost: item.totalCost ?? 0,
      material,
      productionRecord: savedProductionRecord,
    });

    productionMaterialList.push(productionMaterial);
  }
  if (productionMaterialList.length > 0) {
    await productionMaterialRepo.save(productionMaterialList);
  }

  // 2. Create utilities
  const productionUtilityList: ProductionUtilityEntity[] = [];
  for (const item of productionUtilities) {
    const utilityId = item.id;
    if (!utilityId) continue;

    const utility = await utilityRepo.findOneBy({ id: utilityId });
    if (!utility) continue;

    const productionUtility = productionUtilityRepo.create({
      utility: utility,
      quantity: item.quantity ?? 0,
      totalCost: item.totalCost ?? 0,
      productionRecord: savedProductionRecord,
    });

    productionUtilityList.push(productionUtility);
  }
  if (productionUtilityList.length > 0) {
    await productionUtilityRepo.save(productionUtilityList);
  }

  // 3. create employees (labors)
  const productionLaborList: ProductionLaborEntity[] = [];
  for (const item of parseProductionLabors) {
    const employeeId = item.id;
    if (!employeeId) continue;

    const employee = await employeeRepo.findOneBy({ id: employeeId });
    if (!employee) continue;

    const productionLabor = productionLaborRepo.create({
      employee: employee,
      productionRecord: savedProductionRecord,
      totalCost: item.totalCost
    });

    productionLaborList.push(productionLabor);
  }
  if (productionLaborList.length > 0) {
    await productionLaborRepo.save(productionLaborList);
  }

  const fullRecord = await productionRecordRepo.findOne({
    where: { id: savedProductionRecord.id },
    relations: [
      "product",
      "warehouse",
      "warehouse.warehouseProducts",
      "warehouse.warehouseProducts.product",
      "productionMaterials",
      "productionMaterials.material",
      "productionUtilities",
      "productionUtilities.utility",
      "productionLabors",
      "productionLabors.employee",
    ],
  });

  return fullRecord;
}

export async function updateProduction(
  id: string,
  data: Partial<ProductionRecord>,
  productionMaterials: ProductionMaterial[],
  productionUtilities: ProductionUtility[],
  parseProductionLabors: ProductionLabor[]
) {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const productionMaterialRepo = AppDataSource.getRepository(ProductionMaterialEntity);
  const productionUtilityRepo = AppDataSource.getRepository(ProductionUtilityEntity);
  const productionLaborRepo = AppDataSource.getRepository(ProductionLaborEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const utilityRepo = AppDataSource.getRepository(UtilityEntity);
  const employeeRepo = AppDataSource.getRepository(EmployeeEntity);
  const warehouseProductRepo = AppDataSource.getRepository(WarehouseProductEntity);
  const stockChangeRepo = AppDataSource.getRepository(StockChangeEntity);
  const stockProductRepo = AppDataSource.getRepository(StockProductEntity);

  const existingRecord = await productionRecordRepo.findOne({
    where: { id },
    relations: [
      "productionMaterials",
      "productionUtilities",
      "productionLabors",
      "warehouse",
      "product"
    ],
  });

  if (!existingRecord) throw new Error("ProductionRecord not found");

  productionRecordRepo.merge(existingRecord, data);
  const updatedProductionRecord = await productionRecordRepo.save(existingRecord);

  await productionMaterialRepo.delete({ productionRecord: { id } });
  await productionUtilityRepo.delete({ productionRecord: { id } });
  await productionLaborRepo.delete({ productionRecord: { id } });

  const newMaterials: ProductionMaterialEntity[] = [];
  for (const item of productionMaterials) {
    if (!item.material?.id) continue;
    const material = await productRepo.findOneBy({ id: item.material.id });
    if (!material) continue;

    const totalCost = (material.cost || 0) * (item.quantity ?? 0);
    newMaterials.push(
      productionMaterialRepo.create({
        quantity: item.quantity ?? 0,
        totalCost,
        material,
        productionRecord: updatedProductionRecord,
      })
    );
  }
  if (newMaterials.length > 0) await productionMaterialRepo.save(newMaterials);

  const newUtilities: ProductionUtilityEntity[] = [];
  for (const item of productionUtilities) {
    const utility = await utilityRepo.findOneBy({ id: item.utility?.id });
    if (!utility) continue;

    const totalCost = (utility.costPerUnit || 0) * (item.quantity ?? 0);
    newUtilities.push(
      productionUtilityRepo.create({
        utility,
        quantity: item.quantity ?? 0,
        totalCost,
        productionRecord: updatedProductionRecord,
      })
    );
  }
  if (newUtilities.length > 0) await productionUtilityRepo.save(newUtilities);

  const newLabors: ProductionLaborEntity[] = [];
  for (const item of parseProductionLabors) {
    const employee = await employeeRepo.findOneBy({ id: item.employee?.id });
    if (!employee) continue;

    const totalCost = item.totalCost ?? 0;
    newLabors.push(
      productionLaborRepo.create({
        employee,
        productionRecord: updatedProductionRecord,
        totalCost,
      })
    );
  }
  if (newLabors.length > 0) await productionLaborRepo.save(newLabors);

  if (
    updatedProductionRecord.status === ProductionStatus.completed &&
    updatedProductionRecord.warehouse &&
    updatedProductionRecord.product &&
    typeof updatedProductionRecord.quantity === "number"
  ) {
    const warehouse = updatedProductionRecord.warehouse;
    const product = updatedProductionRecord.product;

    // create stock in sheet
    const productCost = product.cost || 0;
    const stockIn = stockChangeRepo.create({
      type: StockChangeType.stockIn,
      status: StockChangeStatus.completed,
      date: new Date(),
      warehouse,
      notes: `Stock in for updating production ${updatedProductionRecord.productionNumber}`,
      subtotal: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
      supplier: data.warehouse?.name
    });
    await stockChangeRepo.save(stockIn);

    const stockInProduct = stockProductRepo.create({
      product,
      quantity: updatedProductionRecord.quantity,
      unitCost: productCost,
      totalCost: productCost * updatedProductionRecord.quantity,
      stockChange: stockIn,
    });
    await stockProductRepo.save(stockInProduct);

    stockIn.subtotal = stockInProduct.totalCost;
    stockIn.totalAmount = stockInProduct.totalCost;
    await stockChangeRepo.save(stockIn);

    let productStock = await warehouseProductRepo.findOne({
      where: { warehouse: { id: warehouse.id }, product: { id: product.id } },
      relations: ["warehouse", "product"],
    });
    if (productStock) {
      productStock.quantity += updatedProductionRecord.quantity;
    } else {
      productStock = warehouseProductRepo.create({
        warehouse,
        product,
        quantity: updatedProductionRecord.quantity,
      });
    }
    await warehouseProductRepo.save(productStock);

    const productEntity = await productRepo.findOneBy({ id: product.id });
    if (productEntity) {
      productEntity.stock = (productEntity.stock ?? 0) + updatedProductionRecord.quantity;
      await productRepo.save(productEntity);
    }

    // create stock out sheet
    const stockOut = stockChangeRepo.create({
      type: StockChangeType.stockOut,
      status: StockChangeStatus.completed,
      date: new Date(),
      warehouse,
      notes: `Stock out materials for updating production ${updatedProductionRecord.productionNumber}`,
      subtotal: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
      supplier: data.warehouse?.name
    });
    await stockChangeRepo.save(stockOut);

    let totalStockOut = 0;
    for (const item of newMaterials) {
      const material = item.material;
      if (!material) continue;

      const unitCost = material.cost || 0;
      const totalCost = unitCost * item.quantity;

      const stockProduct = stockProductRepo.create({
        product: material,
        quantity: item.quantity,
        unitCost,
        totalCost,
        stockChange: stockOut,
      });
      await stockProductRepo.save(stockProduct);

      totalStockOut += totalCost;

      const materialStock = await warehouseProductRepo.findOne({
        where: { warehouse: { id: warehouse.id }, product: { id: material.id } },
        relations: ["warehouse", "product"],
      });
      if (materialStock) {
        materialStock.quantity -= item.quantity;
        if (materialStock.quantity < 0) materialStock.quantity = 0;
        await warehouseProductRepo.save(materialStock);
      }

      const materialEntity = await productRepo.findOneBy({ id: material.id });
      if (materialEntity) {
        materialEntity.stock = (materialEntity.stock ?? 0) - item.quantity;
        if (materialEntity.stock < 0) materialEntity.stock = 0;
        await productRepo.save(materialEntity);
      }
    }

    stockOut.subtotal = totalStockOut;
    stockOut.totalAmount = totalStockOut;
    await stockChangeRepo.save(stockOut);
  }

  const incompleteRecords = await productionRecordRepo.find({
    where: { status: Not(ProductionStatus.completed) },
    relations: ["productionMaterials", "productionMaterials.material"],
  });

  for (const record of incompleteRecords) {
    let hasLack = false;
    for (const pm of record.productionMaterials ?? []) {
      const material = await productRepo.findOneBy({ id: pm.material?.id });
      if (!material) continue;
      if ((material.stock ?? 0) < (pm.quantity ?? 0)) {
        hasLack = true;
        break;
      }
    }

    if (hasLack && record.status !== ProductionStatus.lackMaterial) {
      record.status = ProductionStatus.lackMaterial;
      await productionRecordRepo.save(record);
    }
  }

  const fullUpdatedRecord = await productionRecordRepo.findOne({
    where: { id: updatedProductionRecord.id },
    relations: [
      "product",
      "warehouse",
      "warehouse.warehouseProducts",
      "warehouse.warehouseProducts.product",
      "productionMaterials",
      "productionMaterials.material",
      "productionUtilities",
      "productionUtilities.utility",
      "productionLabors",
      "productionLabors.employee",
    ],
  });

  return fullUpdatedRecord;
}

export async function deleteProduction(id: string) {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const productionMaterialRepo = AppDataSource.getRepository(ProductionMaterialEntity);

  await productionMaterialRepo.delete({ productionRecord: { id } });

  return productionRecordRepo.delete(id);
} 