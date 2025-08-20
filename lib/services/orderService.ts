import { AppDataSource } from "@/lib/database/typeorm";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { OrderItemEntity } from "@/lib/database/entities/order-item.entity";
import { CustomerEntity } from "@/lib/database/entities/customer.entity";
import { Not } from "typeorm";
import { ProductEntity, StockChangeEntity } from "../database/entities";
import { OrderStatus, StockChangeStatus, StockChangeType } from "@/types";
import { StockProductEntity } from "../database/entities/stock-product.entity";
import { WarehouseProductEntity } from "../database/entities/warehouse-product.entity";

export type CreateOrderInput = Omit<Partial<OrderEntity>, 'customer' | 'items'> & { customer?: string; items?: string[] };

export async function getAllOrders({ page = 1, limit = 20, sortBy = "date", sortOrder = "desc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(OrderEntity);
  const qb = repo.createQueryBuilder("order");

  // Join customer
  qb.leftJoinAndSelect("order.customer", "customer");

  // Filtering
  if (filters.status) qb.andWhere("order.status = :status", { status: filters.status });
  if (filters.customer) qb.andWhere("order.customer ILIKE :customer", { customer: `%${filters.customer}%` });
  if (filters.dateFrom) qb.andWhere("order.deliveryDate >= :dateFrom", { dateFrom: filters.dateFrom });
  if (filters.dateTo) qb.andWhere("order.deliveryDate <= :dateTo", { dateTo: filters.dateTo });
  if (filters.paymentStatus) qb.andWhere("order.paymentStatus = :paymentStatus", { paymentStatus: filters.paymentStatus });
  if (filters.paymentMethod) qb.andWhere("order.paymentMethod = :paymentMethod", { paymentMethod: filters.paymentMethod });
  if (filters.totalAmountFrom) qb.andWhere("order.totalAmount >= :totalAmountFrom", { totalAmountFrom: filters.totalAmountFrom });
  if (filters.totalAmountTo) qb.andWhere("order.totalAmount <= :totalAmountTo", { totalAmountTo: filters.totalAmountTo });
  if (filters.searchTerm) qb.andWhere("order.orderNumber ILIKE :searchTerm OR order.notes ILIKE :searchTerm or order.shippingAddress ILIKE :searchTerm", { searchTerm: `%${filters.searchTerm}%` });

  // Sorting
  const allowedSortFields = ["deliveryDate", "totalAmount", "customer", "orderNumber"];
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
      'items.product',
      'warehouse',
      'warehouse.warehouseProducts',
      'warehouse.warehouseProducts.product'
    ],
  });
  return order;
}

export async function createOrder(data: OrderEntity) {
  const orderRepo = AppDataSource.getRepository(OrderEntity)
  const orderItemRepo = AppDataSource.getRepository(OrderItemEntity)
  const customerRepo = AppDataSource.getRepository(CustomerEntity)
  const productRepo = AppDataSource.getRepository(ProductEntity)
  const stockChangeRepo = AppDataSource.getRepository(StockChangeEntity)
  const stockProductRepo = AppDataSource.getRepository(StockProductEntity)
  const warehouseProductRepo = AppDataSource.getRepository(WarehouseProductEntity)

  let updatedOrders: OrderEntity[] = []

  // 1. find customer
  let customer: CustomerEntity | null = null
  if (data.customer?.id) {
    customer = await customerRepo.findOne({ where: { id: data.customer.id } })
  }

  // 2. create order
  const order = orderRepo.create({
    deliveryDate: data.deliveryDate,
    totalAmount: data.totalAmount,
    status: data.status,
    paymentStatus: data.paymentStatus,
    paymentMethod: data.paymentMethod,
    shippingAddress: data.shippingAddress,
    notes: data.notes,
    tags: data.tags,
    tax: data.tax,
    shippingFee: data.shippingFee,
    customer: customer || undefined,
    warehouse: data.warehouse
  })
  await orderRepo.save(order)

  // 3. create order items
  if (data.items && data.items.length > 0) {
    const orderItems: OrderItemEntity[] = []

    for (const item of data.items) {
      if (!item.product?.id) continue

      const product = await productRepo.findOne({ where: { id: item.product.id } })
      if (!product) continue

      const orderItem = orderItemRepo.create({
        product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        order,
      })

      orderItems.push(orderItem)
    }

    await orderItemRepo.save(orderItems)
  }

  // 4. if order status is completed -> create stock out sheet
  if (data.status === OrderStatus.completed) {
    const stockChange = stockChangeRepo.create({
      type: StockChangeType.stockOut,
      status: StockChangeStatus.completed,
      date: new Date(),
      warehouse: order.warehouse,
      notes: `Stock out for order ${order.orderNumber}`,
      subtotal: order.totalAmount,
      tax: order.tax,
      totalAmount: order.totalAmount!,
      supplier: order.warehouse?.name
    })

    await stockChangeRepo.save(stockChange)

    for (const item of data.items) {
      const product = await productRepo.findOne({ where: { id: item.product?.id } })
      if (!product) continue

      // decrease total product stock
      if (typeof product.stock === 'number') {
        product.stock -= item.quantity!
        await productRepo.save(product)
      }

      // create warehouse products -> to decrease stock in a warehouse
      let warehouseProduct = await warehouseProductRepo.findOne({
        where: {
          warehouse: { id: data.warehouse?.id },
          product: { id: item.product?.id }
        },
        relations: ["warehouse", "product"]
      })

      if (warehouseProduct) {
        warehouseProduct.quantity -= item.quantity!
        await warehouseProductRepo.save(warehouseProduct)
      } else {
        warehouseProduct = warehouseProductRepo.create({
          warehouse: data.warehouse,
          product,
          quantity: item.quantity,
        });
      }

      const stockProduct = stockProductRepo.create({
        stockChange,
        product,
        unitCost: item.unitPrice,
        quantity: item.quantity,
        totalCost: item.total,
      })
      await stockProductRepo.save(stockProduct)
    }

    // 5. check if other orders lack of product -> update status
    const otherOrders = await orderRepo.find({
      where: {
        status: Not(OrderStatus.completed),
        warehouse: { id: data.warehouse?.id }
      },
      relations: [
        "items",
        "items.product",
        "warehouse",
        "customer"
      ]
    })

    for (const otherOrder of otherOrders) {
      let isLacking = false

      for (const item of otherOrder.items) {
        const wp = await warehouseProductRepo.findOne({
          where: {
            warehouse: { id: otherOrder.warehouse?.id },
            product: { id: item.product?.id }
          },
          relations: ["warehouse", "product"]
        })

        const availableQty = wp?.quantity ?? 0
        const requiredQty = item.quantity ?? 0

        if (requiredQty > availableQty) {
          isLacking = true
          break
        }
      }

      if (isLacking && otherOrder.status !== OrderStatus.lackProduct) {
        otherOrder.status = OrderStatus.lackProduct
        await orderRepo.save(otherOrder)
        updatedOrders.push(otherOrder)
      }
    }
  }

  return {
    createdOrder: order,
    updatedOrders,
  }
}

export async function updateOrder(id: string, data: Partial<OrderEntity>) {
  const orderRepo = AppDataSource.getRepository(OrderEntity)
  const orderItemRepo = AppDataSource.getRepository(OrderItemEntity)
  const customerRepo = AppDataSource.getRepository(CustomerEntity)
  const productRepo = AppDataSource.getRepository(ProductEntity)
  const stockChangeRepo = AppDataSource.getRepository(StockChangeEntity)
  const stockProductRepo = AppDataSource.getRepository(StockProductEntity)
  const warehouseProductRepo = AppDataSource.getRepository(WarehouseProductEntity)

  // 1. get existing order
  const existingOrder = await orderRepo.findOne({
    where: { id },
    relations: ['customer', 'items', 'warehouse'],
  })
  if (!existingOrder) throw new Error('Order not found')

  // 2. update customer if change
  if (data.customer?.id && data.customer.id !== existingOrder.customer?.id) {
    const newCustomer = await customerRepo.findOne({ where: { id: data.customer.id } })
    if (!newCustomer) throw new Error('Customer not found')
    existingOrder.customer = newCustomer
  }

  // 3. update order
  orderRepo.merge(existingOrder, {
    deliveryDate: data.deliveryDate,
    totalAmount: data.totalAmount,
    status: data.status,
    paymentStatus: data.paymentStatus,
    paymentMethod: data.paymentMethod,
    shippingAddress: data.shippingAddress,
    notes: data.notes,
    tags: data.tags,
    tax: data.tax,
    shippingFee: data.shippingFee,
    warehouse: data.warehouse,
  })
  await orderRepo.save(existingOrder)

  // 4. remove old order items
  if (existingOrder.items?.length) {
    await orderItemRepo.remove(existingOrder.items as OrderItemEntity[])
  }

  // 5. recreate order items
  const orderItems: OrderItemEntity[] = []
  if (data.items?.length) {
    for (const item of data.items) {
      if (!item.product?.id) continue

      const product = await productRepo.findOne({ where: { id: item.product.id } })
      if (!product) continue

      const orderItem = orderItemRepo.create({
        product,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        order: existingOrder,
      })
      orderItems.push(orderItem)
    }
    await orderItemRepo.save(orderItems)
  }

  const updatedOrders: OrderEntity[] = []

  // 6. if order status is completed -> create stock out sheet
  if (data.status === OrderStatus.completed) {
    const stockChange = stockChangeRepo.create({
      type: StockChangeType.stockOut,
      status: StockChangeStatus.completed,
      date: new Date(),
      warehouse: existingOrder.warehouse,
      notes: `Stockout for order ${existingOrder.orderNumber}`,
      subtotal: existingOrder.totalAmount,
      tax: existingOrder.tax,
      totalAmount: existingOrder.totalAmount,
      supplier: existingOrder.warehouse?.name
    })
    await stockChangeRepo.save(stockChange)

    for (const item of data.items ?? []) {
      const product = await productRepo.findOne({ where: { id: item.product?.id } })
      if (!product) continue

      // decrease total product
      if (typeof product.stock === 'number') {
        product.stock -= item.quantity ?? 0
        await productRepo.save(product)
      }

      // create warehouse products -> to decrease stock in a warehouse
      const warehouseProduct = await warehouseProductRepo.findOne({
        where: {
          warehouse: { id: existingOrder.warehouse?.id },
          product: { id: item.product?.id },
        },
        relations: ['warehouse', 'product'],
      })
      if (warehouseProduct) {
        warehouseProduct.quantity -= item.quantity ?? 0
        await warehouseProductRepo.save(warehouseProduct)
      }

      const stockProduct = stockProductRepo.create({
        stockChange,
        product,
        unitCost: item.unitPrice,
        quantity: item.quantity,
        totalCost: item.total,
      })
      await stockProductRepo.save(stockProduct)
    }

    // 7. check if other orders lack products -> update status
    const otherOrders = await orderRepo.find({
      where: {
        status: Not(OrderStatus.completed),
        warehouse: { id: data.warehouse?.id },
      },
      relations: ['items', 'items.product', 'warehouse', 'customer'],
    })

    for (const otherOrder of otherOrders) {
      let isLacking = false

      for (const item of otherOrder.items) {
        const wp = await warehouseProductRepo.findOne({
          where: {
            warehouse: { id: otherOrder.warehouse?.id },
            product: { id: item.product?.id },
          },
          relations: ['warehouse', 'product'],
        })

        const availableQty = wp?.quantity ?? 0
        const requiredQty = item.quantity ?? 0

        if (requiredQty > availableQty) {
          isLacking = true
          break
        }
      }

      if (isLacking && otherOrder.status !== OrderStatus.lackProduct) {
        otherOrder.status = OrderStatus.lackProduct
        await orderRepo.save(otherOrder)
        updatedOrders.push(otherOrder)
      }
    }
  }

  // 8. return updated order
  const finalUpdatedOrder = await orderRepo.findOne({
    where: { id },
    relations: [
      'customer',
      'items',
      'items.product',
      'warehouse',
      'warehouse.warehouseProducts',
      'warehouse.warehouseProducts.product',
    ],
  })

  return {
    updatedOrder: finalUpdatedOrder,
    affectedOrders: updatedOrders,
  }
}


export async function deleteOrder(id: string) {
  const repo = AppDataSource.getRepository(OrderEntity);
  return repo.delete(id);
} 