import { AppDataSource } from "@/lib/database/typeorm";
import { ProductionRecord } from "@/types/production";
import { ProductionRecordEntity } from "../database/entities/production-record.entity";
import { ProductionMaterial } from "@/types/productionMaterial";
import { ProductionMaterialEntity } from "../database/entities/production-material.entity";
import { ProductEntity } from "../database/entities";

export async function getAllProductionRecords() {
  const repo = AppDataSource.getRepository(ProductionRecordEntity);
  const qb = repo
    .createQueryBuilder("productionRecord")
    .leftJoinAndSelect("productionRecord.product", "product")
    .leftJoinAndSelect("productionRecord.productionMaterials", "productionMaterials")
    .leftJoinAndSelect("productionMaterials.material", "material");
  const [data] = await qb.getManyAndCount();
  return { data };
}

export async function createProductionRecord(
  data: Partial<ProductionRecord>,
  productionMaterials: ProductionMaterial[],
) {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const productionMaterialRepo = AppDataSource.getRepository(ProductionMaterialEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);

  // create production record
  const productionRecord = productionRecordRepo.create(data);
  const savedProductionRecord = await productionRecordRepo.save(productionRecord);

  // save product_material
  let productionMaterialList = <ProductionMaterialEntity[]>[]
  for (const item of productionMaterials) {
    if (!item.material?.id) continue;

    const material = await productRepo.findOneBy({ id: item.material.id });
    if (!material) continue;

    const productionMaterial = productionMaterialRepo.create({
      quantity: item.quantity ?? 0,
      totalCost: item.totalCost ?? 0,
      material: material,
      productionRecord: savedProductionRecord
    });
    productionMaterialList.push(productionMaterial)
  }
  await productionMaterialRepo.save(productionMaterialList);

  return savedProductionRecord;
}

export async function updateProduction(
  id: string,
  data: Partial<ProductionRecord>,
  productionMaterials: ProductionMaterial[],
) {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const productionMaterialRepo = AppDataSource.getRepository(ProductionMaterialEntity);
  const productRepo = AppDataSource.getRepository(ProductEntity);

  const existingRecord = await productionRecordRepo.findOne({
    where: { id },
    relations: ["productionMaterials"],
  });

  if (!existingRecord) {
    throw new Error("ProductionRecord not found");
  }

  // update ProductionRecord
  productionRecordRepo.merge(existingRecord, data);
  const updatedProductionRecord = await productionRecordRepo.save(existingRecord);

  // remove old productionMaterials records
  await productionMaterialRepo.delete({ productionRecord: { id } });

  // create new productionMaterials records
  const newMaterials: ProductionMaterialEntity[] = [];
  for (const item of productionMaterials) {
    if (!item.material?.id) continue;

    const material = await productRepo.findOneBy({ id: item.material.id });
    if (!material) continue;

    const newPM = productionMaterialRepo.create({
      quantity: item.quantity ?? 0,
      totalCost: item.totalCost ?? 0,
      material: material,
      productionRecord: updatedProductionRecord
    });

    newMaterials.push(newPM);
  }
  await productionMaterialRepo.save(newMaterials);

  return updatedProductionRecord;
}

export async function deleteProduction(id: string) {
  const productionRecordRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const productionMaterialRepo = AppDataSource.getRepository(ProductionMaterialEntity);

  await productionMaterialRepo.delete({ productionRecord: { id } });

  return productionRecordRepo.delete(id);
} 