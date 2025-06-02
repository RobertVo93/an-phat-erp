import { AppDataSource } from "@/lib/database/typeorm";
import { OrderItemEntity } from "@/lib/database/entities/order-item.entity";
import { In } from "typeorm";

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