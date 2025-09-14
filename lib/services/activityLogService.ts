import { AppDataSource } from "@/lib/database/typeorm";
import { ActivityLogEntity } from "@/lib/database/entities/activity-log.entity";
import { IActivityLog } from "@/types/activity-log.interface";
import { ResourceType } from '@/types/enums';

export async function addMultipleActivityLogService(logs: IActivityLog[]) {
  if (logs.length === 0) return [];

  const repo = AppDataSource.getRepository(ActivityLogEntity);
  const entities = repo.create(logs);
  return await repo.save(entities);
}

export async function getActivityLogsByTargetIdService(resource: ResourceType, targetId: string) {
  const repo = AppDataSource.getRepository(ActivityLogEntity);
  return await repo.find({
    where: { targetId, resource },
    order: { createdAt: "DESC", field: "ASC" },
  });
}

export async function getActivityLogsByFilterService({ page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(ActivityLogEntity);
  const qb = repo.createQueryBuilder("activityLog");

  // Filtering
  if (filters.resource) qb.andWhere("activityLog.resource = :resource", { resource: filters.resource });
  if (filters.targetId) qb.andWhere("activityLog.targetId = :targetId", { targetId: filters.targetId });
  if (filters.field) qb.andWhere("activityLog.field = :field", { field: filters.field });
  if (filters.updatedUser) qb.andWhere("activityLog.updatedUser = :updatedUser", { updatedUser: filters.updatedUser });

  // Sorting
  qb.orderBy(`activityLog.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getActivityLogByIdService(id: string) {
  const repo = AppDataSource.getRepository(ActivityLogEntity);
  return repo.findOneBy({ id });
}

export async function addActivityLogService(data: ActivityLogEntity) {
  const repo = AppDataSource.getRepository(ActivityLogEntity);
  const added = repo.create(data);
  return repo.save(added);
}

export async function updateActivityLogService(
  id: string,
  data: Partial<ActivityLogEntity>
) {
  const repo = AppDataSource.getRepository(ActivityLogEntity);
  const record = await repo.findOneBy({ id });
  if (!record) throw new Error("Activity Log not found");
  repo.merge(record, data);
  return await repo.save(record);
}

export async function deleteActivityLogService(id: string) {
  const repo = AppDataSource.getRepository(ActivityLogEntity);
  const record = await repo.findOneBy({ id });
  if (!record) throw new Error("Activity Log not found");
  await repo.remove(record);
  return true;
} 