import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { getCustomerById } from "@/lib/services/customerService";
import { getOrderItemsByIds } from "@/lib/services/orderItemService";
import { OrderItemEntity } from "@/lib/database/entities/order-item.entity";
import { CustomerEntity } from "@/lib/database/entities/customer.entity";

export type CreateOrderInput = Omit<Partial<OrderEntity>, 'customer' | 'items'> & { customer?: string; items?: string[] };

export async function getAllOrders({ page = 1, limit = 20, sortBy = "date", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const qb = repo.createQueryBuilder("order");

  // Filtering
  if (filters.status) qb.andWhere("order.status = :status", { status: filters.status });
  if (filters.customer) qb.andWhere("order.customer ILIKE :customer", { customer: `%${filters.customer}%` });
  if (filters.dateFrom) qb.andWhere("order.date >= :dateFrom", { dateFrom: filters.dateFrom });
  if (filters.dateTo) qb.andWhere("order.date <= :dateTo", { dateTo: filters.dateTo });

  // Sorting
  qb.orderBy(`order.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getOrderById(id: string) {
  const repo = AppDataSource.getRepository(OrderEntity);
  return repo.findOneBy({ id });
}

export async function createOrder(data: CreateOrderInput) {
  const repo = AppDataSource.getRepository(OrderEntity);

  // Use the customer service
  let customer: CustomerEntity | undefined = undefined;
  if (data.customer) {
    customer = await getCustomerById(data.customer);
    if (!customer) throw new Error("Customer not found");
  }

  // Use the order item service
  let items: OrderItemEntity[] = [];
  if (data.items && data.items.length > 0) {
    items = await getOrderItemsByIds(data.items);
    if (items.length !== data.items.length) {
      throw new Error("One or more order items not found");
    }
  }

  // Create order entity
  const order = repo.create({
    ...data,
    customer,
    items,
  });

  return repo.save(order);
}

export async function updateOrder(id: string, data: Partial<OrderEntity> & { customer?: string; items?: string[] }) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const updateData: Partial<OrderEntity> = { ...data };

  // If customer is being updated, fetch the entity
  if (data.customer) {
    const customer = await getCustomerById(data.customer);
    if (!customer) throw new Error("Customer not found");
    updateData.customer = customer;
  }

  // If items are being updated, fetch the entities
  if (data.items && data.items.length > 0) {
    const items = await getOrderItemsByIds(data.items);
    if (items.length !== data.items.length) {
      throw new Error("One or more order items not found");
    }
    updateData.items = items;
  }

  await repo.update(id, updateData);
  return repo.findOneBy({ id });
}

export async function deleteOrder(id: string) {
  const repo = AppDataSource.getRepository(OrderEntity);
  return repo.delete(id);
} 