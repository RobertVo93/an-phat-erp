import { AppDataSource } from "@/lib/database/typeorm";
import { ProductEntity } from "@/lib/database/entities/product.entity";

export async function getAllProducts() {
  const repo = AppDataSource.getRepository(ProductEntity);
  return repo.find();
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