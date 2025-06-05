import { AppDataSource } from "@/lib/database/typeorm";
import { ProductEntity } from "@/lib/database/entities/product.entity";
import { CollectionEntity } from "../database/entities";
import { In } from "typeorm";
import { Product } from "@/types/product";

export async function getAllProducts({
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
    collectionId?: string;
    name?: string;
    status?: string;
    supplier?: string;
    search?: string;
  };
} = {}) {
  const repo = AppDataSource.getRepository(ProductEntity);

  // Step 1: Get all matching product IDs
  const subQuery = repo
    .createQueryBuilder("product")
    .select("product.id", "id")
    .leftJoin("product.collections", "collection");

  if (filters.collectionId && filters.collectionId !== "all") {
    subQuery.andWhere("collection.id = :collectionId", { collectionId: filters.collectionId });
  }
  if (filters.name) {
    subQuery.andWhere("product.name ILIKE :name", { name: `%${filters.name}%` });
  }
  if (filters.status && filters.status !== "all") {
    subQuery.andWhere("product.status = :status", { status: filters.status });
  }
  if (filters.supplier) {
    subQuery.andWhere("product.supplier ILIKE :supplier", { supplier: `%${filters.supplier}%` });
  }
  if (filters.search) {
    subQuery.andWhere(
      "(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search OR product.barcode ILIKE :search)",
      { search: `%${filters.search}%` }
    );
  }

  const fullIdsQuery = subQuery.orderBy(`product.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  const allMatchingIds = await fullIdsQuery.getRawMany();
  const total = allMatchingIds.length;

  const pagedIds = allMatchingIds
    .slice((page - 1) * limit, page * limit)
    .map((row) => row.id);

  if (pagedIds.length === 0) {
    return { data: [], total, page, limit };
  }

  // Step 2: Get full product data using filtered IDs
  const data = await repo
    .createQueryBuilder("product")
    .leftJoinAndSelect("product.collections", "collection")
    .whereInIds(pagedIds)
    .orderBy(`product.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC")
    .getMany();

  return { data, total, page, limit };
}

export async function getProductById(id: string) {
  const repo = AppDataSource.getRepository(ProductEntity);
  return repo.findOneBy({ id });
}

export async function createProduct(data: Partial<Product>) {
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const collectionRepo = AppDataSource.getRepository(CollectionEntity);

  const { collections, ...productData } = data;

  const product = productRepo.create(productData);

  if (!Array.isArray(collections)) {
    console.error("⚠️ collections is not an array:", collections);
  }

  const collectionIds = Array.isArray(collections)
    ? collections.map((col) => col.id)
    : [];

  if (collectionIds.length > 0) {
    const collections = await collectionRepo.findBy({ id: In(collectionIds) });
    product.collections = collections;
  }

  const created = await productRepo.save(product);

  return created
}

export async function updateProduct(id: string, data: Partial<ProductEntity>) {
  const productRepo = AppDataSource.getRepository(ProductEntity);
  const collectionRepo = AppDataSource.getRepository(CollectionEntity);

  const { collections, ...productData } = data;

  const product = await productRepo.findOne({
    where: { id },
    relations: { collections: true },
  });

  if (!product) throw new Error("Product not found");

  Object.assign(product, productData);

  if (collections !== undefined) {
    const collectionIds = collections.map(col => col.id);
    product.collections = collectionIds.length > 0
      ? await collectionRepo.findBy({ id: In(collectionIds) })
      : [];
  }

  const updated = await productRepo.save(product);

  return updated;
}

export async function deleteProduct(id: string) {
  const repo = AppDataSource.getRepository(ProductEntity);

  const product = await repo.findOne({
    where: { id },
    relations: { collections: true },
  });

  if (!product) throw new Error("Product not found");

  product.collections = [];
  await repo.save(product);

  return repo.delete(id);
} 