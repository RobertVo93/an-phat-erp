import { AppDataSource } from "@/lib/database/typeorm";
import { ProductEntity } from "@/lib/database/entities/product.entity";

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
    name?: string;
    status?: string;
    supplier?: string;
    search?: string;
  };
} = {}) {
  const repo = AppDataSource.getRepository(ProductEntity);
  const qb = repo.createQueryBuilder("product");

  // Filtering
  if (filters.name) qb.andWhere("product.name ILIKE :name", { name: `%${filters.name}%` });
  if (filters.status) qb.andWhere("product.status = :status", { status: filters.status });
  if (filters.supplier) qb.andWhere("product.supplier ILIKE :supplier", { supplier: `%${filters.supplier}%` });
  if (filters.search) {
    qb.andWhere(
      "(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search OR product.barcode ILIKE :search)",
      { search: `%${filters.search}%` }
    );
  }

  // Sorting
  qb.orderBy(`product.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getProductById(id: string) {
  const repo = AppDataSource.getRepository(ProductEntity);
  return repo.findOneBy({ id });
}

export async function createProduct(data: Partial<ProductEntity>) {
  const repo = AppDataSource.getRepository(ProductEntity);
  const product = repo.create(data);
  return repo.save(product);
}

export async function updateProduct(id: string, data: Partial<ProductEntity>) {
  const repo = AppDataSource.getRepository(ProductEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteProduct(id: string) {
  const repo = AppDataSource.getRepository(ProductEntity);
  return repo.delete(id);
} 