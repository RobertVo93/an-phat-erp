import { AppDataSource } from "@/lib/database/typeorm";
import { OrderItemEntity } from "@/lib/database/entities/order-item.entity";
import { In } from "typeorm";

export async function getAllOrderItems({ page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(OrderItemEntity);
  const qb = repo.createQueryBuilder("orderItem");

  // Filtering
  if (filters.order) qb.andWhere("orderItem.order_id = :orderId", { orderId: filters.order });
  if (filters.product) qb.andWhere("orderItem.product_id = :productId", { productId: filters.product });

  // Sorting
  qb.orderBy(`orderItem.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getOrderItemById(id: string) {
  const repo = AppDataSource.getRepository(OrderItemEntity);
  return repo.findOneBy({ id });
}

export async function getOrderItemsByIds(ids: string[]): Promise<OrderItemEntity[]> {
  if (!ids.length) return [];
  const repo = AppDataSource.getRepository(OrderItemEntity);
  const items = await repo.find({
    where: {
      id: In(ids)
    }
  });
  return items;
}

export async function createOrderItem(data: Partial<OrderItemEntity>) {
  const repo = AppDataSource.getRepository(OrderItemEntity);
  const orderItem = repo.create(data);
  return repo.save(orderItem);
}

export async function updateOrderItem(id: string, data: Partial<OrderItemEntity>) {
  const repo = AppDataSource.getRepository(OrderItemEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteOrderItem(id: string) {
  const repo = AppDataSource.getRepository(OrderItemEntity);
  return repo.delete(id);
}