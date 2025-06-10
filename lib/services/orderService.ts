import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { getCustomerById } from "@/lib/services/customerService";
import { getOrderItemsByIds } from "@/lib/services/orderItemService";
import { OrderItemEntity } from "@/lib/database/entities/order-item.entity";
import { CustomerEntity } from "@/lib/database/entities/customer.entity";
import { In } from "typeorm";

export type CreateOrderInput = Omit<Partial<OrderEntity>, 'customer' | 'items'> & { customer?: string; items?: string[] };

export async function getAllOrders({ page = 1, limit = 20, sortBy = "date", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const qb = repo.createQueryBuilder("order");

  // Join customer
  qb.leftJoinAndSelect("order.customer", "customer");

  // Filtering
  if (filters.status) qb.andWhere("order.status = :status", { status: filters.status });
  if (filters.customer) qb.andWhere("order.customer ILIKE :customer", { customer: `%${filters.customer}%` });
  if (filters.dateFrom) qb.andWhere("order.date >= :dateFrom", { dateFrom: filters.dateFrom });
  if (filters.dateTo) qb.andWhere("order.date <= :dateTo", { dateTo: filters.dateTo });

  // Sorting
  const allowedSortFields = ["deliveryDate", "totalAmount", "status", "paymentStatus", "paymentMethod", "shippingAddress"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "deliveryDate";
  qb.orderBy(`order.${sortField}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getOrderById(id: string) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const order = await repo.findOne({
    where: { id },
    relations: [
      'customer',
      'items',
      'items.product'
    ],
  });
  return order;
}

export async function createOrder(data: CreateOrderInput) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const customerRepo = AppDataSource.getRepository(CustomerEntity);
  const orderItemRepo = AppDataSource.getRepository(OrderItemEntity);

  // Use the customer service
  let customer: CustomerEntity | undefined = undefined;
  if (data.customer) {
    customer = await getCustomerById(data.customer);
    if (!customer) throw new Error("Customer not found");
  }

  // Use the order item service
  let items: OrderItemEntity[] = []
  if (data.items && data.items.length > 0) {
    items = await orderItemRepo.find({
      where: { id: In(data.items) },
      relations: ["product"],
    })

    if (items.length !== data.items.length) {
      throw new Error("One or more order items not found")
    }
  }

  // Create order entity
  const order = repo.create({
    ...data,
    customer,
    items,
    shippingFee: data.shippingFee,
    tax: data.tax
  });
  const createdOrder = await repo.save(order)

  // update customer last order
  if (customer?.id) {
    await customerRepo.update(
      { id: customer.id },
      { lastOrder: new Date() }
    )
  }

  return createdOrder;
}

export async function updateOrder(
  id: string,
  data: Partial<OrderEntity> & { customer?: string; items?: string[] }
) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const customerRepo = AppDataSource.getRepository(CustomerEntity);
  const orderItemRepo = AppDataSource.getRepository(OrderItemEntity);

  const existingOrder = await repo.findOne({
    where: { id },
    relations: ["items", "customer"]
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  // Handle customer
  let customer: CustomerEntity | undefined = undefined;
  if (data.customer) {
    customer = await getCustomerById(data.customer);
    if (!customer) throw new Error("Customer not found");
  }

  // Handle items
  let items: OrderItemEntity[] = [];
  if (data.items && data.items.length > 0) {
    items = await orderItemRepo.find({
      where: { id: In(data.items) },
      relations: ["product"],
    });

    if (items.length !== data.items.length) {
      throw new Error("One or more order items not found");
    }
  }

  // Preload order with updated fields
  const updatedOrder = await repo.preload({
    id,
    ...data,
    customer: customer ?? existingOrder.customer,
    items: items.length > 0 ? items : existingOrder.items,
  });

  if (!updatedOrder) {
    throw new Error("Failed to preload order for update");
  }

  await repo.save(updatedOrder);

  // Update customer last order
  if (customer?.id) {
    await customerRepo.update(
      { id: customer.id },
      { lastOrder: new Date() }
    );
  }

  return repo.findOne({
    where: { id },
    relations: ["items", "items.product", "customer"]
  });
}

export async function deleteOrder(id: string) {
  const repo = AppDataSource.getRepository(OrderEntity);
  return repo.delete(id);
} 