import { AppDataSource } from "@/lib/database/typeorm";
import { ProductionRecord } from "@/types/production";
import { ProductionRecordEntity } from "../database/entities/production-record.entity";
import { ProductionMaterial } from "@/types/productionMaterial";
import { ProductionMaterialEntity } from "../database/entities/production-material.entity";
import { EmployeeEntity, ProductEntity, UtilityEntity } from "../database/entities";
import { ProductionUtility } from "@/types/productionUtility";
import { ProductionUtilityEntity } from "../database/entities/production-utility.entity";
import { ProductionLabor } from "@/types/ProductionLabor";
import { ProductionLaborEntity } from "../database/entities/production-labor.entity";

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
    .leftJoinAndSelect("productionLabors.employee", "employee");

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
      utility,
      quantity: item.quantity ?? 0,
      cost: item.cost ?? 0,
      unit: item.unit ?? utility.unit ?? "",
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


  const existingRecord = await productionRecordRepo.findOne({
    where: { id },
    relations: ["productionMaterials", "productionUtilities", "productionLabors"],
  });

  if (!existingRecord) {
    throw new Error("ProductionRecord not found");
  }

  productionRecordRepo.merge(existingRecord, data);
  const updatedProductionRecord = await productionRecordRepo.save(existingRecord);

  // 1. Remove old productionMaterials, productionUtilities, productionLabors
  await productionMaterialRepo.delete({ productionRecord: { id } });
  await productionUtilityRepo.delete({ productionRecord: { id } });
  await productionLaborRepo.delete({ productionRecord: { id } });

  // 2. Re-create productionMaterials
  const newMaterials: ProductionMaterialEntity[] = [];
  for (const item of productionMaterials) {
    if (!item.material?.id) continue;

    const material = await productRepo.findOneBy({ id: item.material.id });
    if (!material) continue;

    const newPM = productionMaterialRepo.create({
      quantity: item.quantity ?? 0,
      totalCost: item.totalCost ?? 0,
      material: material,
      productionRecord: updatedProductionRecord,
    });

    newMaterials.push(newPM);
  }
  if (newMaterials.length > 0) {
    await productionMaterialRepo.save(newMaterials);
  }

  // 3. Re-create productionUtilities
  const newUtilities: ProductionUtilityEntity[] = [];
  for (const item of productionUtilities) {
    const utilityId = item.id;
    if (!utilityId) continue;

    const utility = await utilityRepo.findOneBy({ id: utilityId });
    if (!utility) continue;

    const newPU = productionUtilityRepo.create({
      utility: utility,
      quantity: item.quantity ?? 0,
      cost: item.cost ?? 0,
      unit: item.unit ?? utility.unit ?? "",
      productionRecord: updatedProductionRecord,
    });

    newUtilities.push(newPU);
  }
  if (newUtilities.length > 0) {
    await productionUtilityRepo.save(newUtilities);
  }

  // 4. Re-create productionLabors
  const newLabors: ProductionLaborEntity[] = [];
  for (const item of parseProductionLabors) {
    const employeeId = item.id;
    if (!employeeId) continue;

    const employee = await employeeRepo.findOneBy({ id: employeeId });
    if (!employee) continue;

    const newPL = productionLaborRepo.create({
      employee: employee,
      productionRecord: updatedProductionRecord,
    });

    newLabors.push(newPL);
  }
  if (newLabors.length > 0) {
    await productionLaborRepo.save(newLabors);
  }

  const fullUpdatedRecord = await productionRecordRepo.findOne({
    where: { id: updatedProductionRecord.id },
    relations: [
      "product",
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