import { AppDataSource } from "@/lib/database/typeorm";
import { ProductEntity } from "@/lib/database/entities/product.entity";
import { CollectionEntity } from "@/lib/database/entities/collection.entity";
import { In } from "typeorm";
import { Product } from "@/types/product";

export async function getAllProducts({
  page = 1,
  limit = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
  filters = {} as Record<string, any>,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: {
    collectionId?: string;
    status?: string;
    search?: string;
    priceRange?: {
      min: number;
      max: number;
    };
    stockRange?: {
      min: number;
      max: number;
    };
  };
} = {}) {
  const repo = AppDataSource.getRepository(ProductEntity);
  const qb = repo.createQueryBuilder("product");

  // Join customer
  qb.leftJoinAndSelect("product.collections", "collection");

  // Filtering
  if (filters.collectionId) qb.andWhere("collection.id = :collectionId", { collectionId: filters.collectionId });
  if (filters.status) qb.andWhere("product.status = :status", { status: filters.status });
  if (filters.priceRange) qb.andWhere("product.price BETWEEN :min AND :max", { min: filters.priceRange.min, max: filters.priceRange.max });
  if (filters.stockRange) qb.andWhere("product.stock BETWEEN :min AND :max", { min: filters.stockRange.min, max: filters.stockRange.max });
  if (filters.search) qb.andWhere("(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search OR product.barcode ILIKE :search)", { search: `%${filters.search}%` });

  // Sorting
  qb.orderBy(`product.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getProductById(id: string) {
  const repo = AppDataSource.getRepository(ProductEntity);
  return repo.findOne({
    where: { id },
    relations: [
      "collections",
      "warehouseProducts",
      "warehouseProducts.warehouse",
      "warehouseProducts.product"
    ]
  });
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
