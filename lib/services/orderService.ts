import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { ProductEntity } from "@/lib/database/entities/product.entity";
import { StockChangeEntity } from "@/lib/database/entities/stock-change.entity";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { StockChangeStatus, StockChangeType, Order as IOrder, IOrderItem, IChangeLog, IActivityLog, ResourceType, OrderFilters } from "@/types";
import { getCustomerById } from "@/lib/services/customerService";
import { getWarehouseById } from "@/lib/services/warehouseService";
import { addMultipleActivityLogService } from "@/lib/services/activityLogService";
import { deepDifference } from "@/lib/utils";
import { IGNORE_KEYS } from "@/constants";
import { v4 as uuidv4 } from 'uuid';

interface GetAllOrdersParams {
  customerId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: OrderFilters;
}

export async function getAllOrders({
  customerId,
  page = 1,
  limit = 20,
  sortBy = "date",
  sortOrder = "desc",
  filters = {},
}: GetAllOrdersParams) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const qb = repo.createQueryBuilder("order");

  // Join customer
  qb.leftJoinAndSelect("order.customer", "customer");

  // Filtering
  if (customerId !== undefined) qb.andWhere("order.customer_id = :customerId", { customerId });
  if (filters.status) qb.andWhere("order.status = :status", { status: filters.status });
  if (filters.customer) {
    qb.andWhere(
      "(customer.name ILIKE :customer OR customer.number ILIKE :customer OR customer.email ILIKE :customer)",
      { customer: `%${filters.customer}%` },
    );
  }
  if (filters.dateFrom) qb.andWhere("order.deliveryDate >= CAST(:dateFrom AS date)", { dateFrom: filters.dateFrom });
  if (filters.dateTo) {
    qb.andWhere("order.deliveryDate < CAST(:dateTo AS date) + INTERVAL '1 day'", { dateTo: filters.dateTo });
  }
  if (filters.paymentStatus) qb.andWhere("order.paymentStatus = :paymentStatus", { paymentStatus: filters.paymentStatus });
  if (filters.paymentMethod) qb.andWhere("order.paymentMethod = :paymentMethod", { paymentMethod: filters.paymentMethod });
  if (filters.totalAmountFrom !== undefined) {
    qb.andWhere("order.totalAmount >= :totalAmountFrom", { totalAmountFrom: filters.totalAmountFrom });
  }
  if (filters.totalAmountTo !== undefined) {
    qb.andWhere("order.totalAmount <= :totalAmountTo", { totalAmountTo: filters.totalAmountTo });
  }
  if (filters.searchTerm) {
    qb.andWhere(
      "(order.number ILIKE :searchTerm OR order.notes ILIKE :searchTerm OR order.shippingAddress ILIKE :searchTerm OR customer.name ILIKE :searchTerm)",
      { searchTerm: `%${filters.searchTerm}%` },
    );
  }

  // Sorting
  const normalizedSortOrder = sortOrder.toUpperCase() as "ASC" | "DESC";
  if (sortBy === "customer") {
    qb.orderBy("customer.name", normalizedSortOrder);
  } else {
    const sortFieldMap: Record<string, string> = {
      orderDate: "createdAt",
      deliveryDate: "deliveryDate",
      totalAmount: "totalAmount",
      number: "number",
    };
    const sortField = sortFieldMap[sortBy] || "createdAt";
    qb.orderBy(`order.${sortField}`, normalizedSortOrder);
  }

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
      'warehouse',
      'warehouse.warehouseProducts',
      'warehouse.warehouseProducts.product'
    ],
  });
  return order;
}

export async function createOrderService(data: Partial<IOrder>) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const record = repo.create(data);
  return await repo.save(record);
}

export async function updateOrderService(id: string, userId: string, data: Partial<IOrder>) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const userRepo = AppDataSource.getRepository(UserEntity);
  const existingRecord = await repo.findOne({ where: { id } });
  if (!existingRecord) throw new Error("Order not found");

  const user = await userRepo.findOneOrFail({
    where: { id: userId },
    select: ["id", "username"],
  });

  repo.merge(existingRecord, { ...data, updatedBy: user.username })
  await repo.save(existingRecord);
  return existingRecord;
}

export async function deleteOrderService(id: string): Promise<boolean> {
  const repo = AppDataSource.getRepository(OrderEntity);
  const record = await repo.findOne({ where: { id } });
  if (!record) throw new Error("Order not found.");
  await repo.remove(record);
  return true;
}

export async function handleCompleteOrder(record: OrderEntity) {
  await AppDataSource.transaction(async (manager) => {
    const orderRepo = manager.getRepository(OrderEntity);
    const order = await orderRepo.findOne({ where: { id: record.id }, relations: ['warehouse'] });
    const stockChangeRepo = manager.getRepository(StockChangeEntity);
    const productRepo = manager.getRepository(ProductEntity);
    const warehouse = order?.warehouse;

    // 1. StockOut for order items
    if (record.items && record.items.length > 0 && warehouse) {
      const orderItems: IOrderItem[] = [];
      for (const orderItem of record.items) {
        if (orderItem.id) {
          const prod = await productRepo.findOne({ where: { id: orderItem.id } });
          if (prod) {
            orderItems.push({
              id: prod.id,
              number: prod.sku,
              name: prod.name,
              quantity: orderItem.quantity ?? 1,
              unit: prod.unit,
              unitCost: prod.cost,
              totalCost: orderItem.totalCost ?? 0,
            });
          }
        }
      }
      if (orderItems.length > 0 && warehouse) {
        const stockOut = stockChangeRepo.create({
          type: StockChangeType.stockOut,
          date: new Date(),
          supplier: `${record.number}`,
          subtotal: orderItems?.reduce((acc, curr) => acc + (curr.totalCost ?? 0), 0) ?? 0,
          tax: 0,
          discount: 0,
          totalAmount: orderItems?.reduce((acc, curr) => acc + (curr.totalCost ?? 0), 0) ?? 0,
          status: StockChangeStatus.completed,
          notes: `${record.number}`,
          stockProducts: orderItems,
          receivedBy: "System",
          warehouse: warehouse,
        });
        await stockChangeRepo.save(stockOut);
      }
    }
  });
}

export async function handleOrderChangeLogs(previous: OrderEntity, current: OrderEntity) {
  const changes: IChangeLog[] = [];
  const ignoreKeys = [...IGNORE_KEYS, 'customer', 'warehouse', 'items'];  // ignore relation fields and jsonb fields, they need to handle in specific way
  const difference = deepDifference(previous, current);

  for (const key in difference) {
    // Handle jsonb changes
    if (key === 'items') {
      changes.push({
        field: key,
        oldValue: previous.items?.map((item) => ({ number: item.number, quantity: item.quantity, unitCost: item.unitCost })),
        newValue: current.items?.map((item) => ({ number: item.number, quantity: item.quantity, unitCost: item.unitCost })),
      });
    }
    // Handle relation fields changes
    if (key === 'customer' && current.customer?.id !== previous.customer?.id) {
      const newCustomer = await getCustomerById(current.customer?.id!);
      changes.push({
        field: key,
        oldValue: previous.customer?.number,
        newValue: newCustomer?.number,
      });
      continue;
    }
    if (key === 'warehouse' && current.warehouse?.id !== previous.warehouse?.id) {
      const newWarehouse = await getWarehouseById(current.warehouse?.id!);
      changes.push({
        field: key,
        oldValue: previous.warehouse?.number,
        newValue: newWarehouse?.number,
      });
      continue;
    }
    // handle ignore keys
    if (ignoreKeys.includes(key)) continue;

    // add change log
    changes.push({
      field: key,
      oldValue: difference[key].obj1,
      newValue: difference[key].obj2,
    });
  }

  if (changes.length > 0) {
    const transactionId = uuidv4();
    const logs: IActivityLog[] = changes.map((change) => ({
      resource: ResourceType.order,
      targetId: current.id,
      field: change.field,
      oldValue: change.oldValue,
      newValue: change.newValue,
      updatedUser: current.updatedBy,
      transactionId: transactionId,
    }));
    await addMultipleActivityLogService(logs);
  }
  return true;
}
