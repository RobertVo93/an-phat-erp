import { AppDataSource } from "@/lib/database/typeorm";
import { CollectionEntity } from "@/lib/database/entities/Collection";

export async function getAllCollections() {
  const repo = AppDataSource.getRepository(CollectionEntity);
  return repo.find();
}

export async function getCollectionById(id: string) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  return repo.findOneBy({ id });
}

export async function createCollection(data: Partial<CollectionEntity>) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  const collection = repo.create(data);
  return repo.save(collection);
}

export async function updateCollection(id: string, data: Partial<CollectionEntity>) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteCollection(id: string) {
  const repo = AppDataSource.getRepository(CollectionEntity);
  return repo.delete(id);
} 