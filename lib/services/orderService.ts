import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { ProductEntity, StockChangeEntity } from "@/lib/database/entities";
import { StockChangeStatus, StockChangeType, Order as IOrder, IOrderItem } from "@/types";

export async function getAllOrders({ page = 1, limit = 20, sortBy = "date", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const qb = repo.createQueryBuilder("order");

  // Join customer
  qb.leftJoinAndSelect("order.customer", "customer");

  // Filtering
  if (filters.status) qb.andWhere("order.status = :status", { status: filters.status });
  if (filters.dateFrom) qb.andWhere("order.deliveryDate >= :dateFrom", { dateFrom: filters.dateFrom });
  if (filters.dateTo) qb.andWhere("order.deliveryDate <= :dateTo", { dateTo: filters.dateTo });
  if (filters.paymentStatus) qb.andWhere("order.paymentStatus = :paymentStatus", { paymentStatus: filters.paymentStatus });
  if (filters.paymentMethod) qb.andWhere("order.paymentMethod = :paymentMethod", { paymentMethod: filters.paymentMethod });
  if (filters.totalAmountFrom) qb.andWhere("order.totalAmount >= :totalAmountFrom", { totalAmountFrom: filters.totalAmountFrom });
  if (filters.totalAmountTo) qb.andWhere("order.totalAmount <= :totalAmountTo", { totalAmountTo: filters.totalAmountTo });
  if (filters.searchTerm) qb.andWhere("(order.number ILIKE :searchTerm OR order.notes ILIKE :searchTerm or order.shippingAddress ILIKE :searchTerm)", { searchTerm: `%${filters.searchTerm}%` });

  // Sorting
  const allowedSortFields = ["deliveryDate", "totalAmount", "customer", "number"];
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

export async function updateOrderService(id: string, data: Partial<IOrder>) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const existingRecord = await repo.findOne({ where: { id } });
  if (!existingRecord) throw new Error("Order not found");

  repo.merge(existingRecord, data);
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