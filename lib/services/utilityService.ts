import { AppDataSource } from "@/lib/database/typeorm";
import { Utility } from "@/types";
import { UtilityEntity } from "../database/entities";

export async function getUtilities() {
  const repo = AppDataSource.getRepository(UtilityEntity);
  const qb = repo.createQueryBuilder("utility");
  const [data] = await qb.getManyAndCount();
  return { data: data };
}

export async function addUtility(data: Utility) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  const added = repo.create(data);
  return repo.save(added);
}

export async function updateUtility(
  id: string,
  data: Partial<Utility>
) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteUtility(id: string) {
  const repo = AppDataSource.getRepository(UtilityEntity);
  return repo.delete(id);
} 