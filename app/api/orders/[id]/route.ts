import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrder, deleteOrder } from "@/lib/services/orderService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { UpdateOrderSchema } from "../order.schema";
import { OrderEntity } from "@/lib/database/entities/order.entity";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { AppDataSource } from "@/lib/database/typeorm";
import { OrderItemEntity } from "@/lib/database/entities";

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 * 
 *   put:
 *     summary: Update an order
 *     tags: [Order APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MutateOrderRequest'
 *     responses:
 *       200:
 *         description: Order updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 * 
 *   delete:
 *     summary: Delete an order
 *     tags: [Order APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Order ID
 *     responses:
 *       204:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const order = await getOrderById(params.id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export type CreateOrderInput = Omit<Partial<OrderEntity>, 'customer' | 'items'> & { customer?: string; items?: string[] };

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const data = await req.json();
    const orderItemRepo = AppDataSource.getRepository(OrderItemEntity);

    const existingOrder = await AppDataSource.getRepository(OrderEntity).findOne({
      where: { id: params.id },
      relations: ["items"],
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const existingItemIds = new Set(existingOrder.items.map((item) => item.id));

    const updatedOrderItems = [];

    for (const itemInput of data.items) {
      if (itemInput.id && existingItemIds.has(itemInput.id)) {
        // update old data
        await orderItemRepo.update(itemInput.id, {
          product: { id: itemInput.product.id },
          quantity: itemInput.quantity,
          unitPrice: itemInput.unitPrice,
          total: itemInput.total,
        });
        updatedOrderItems.push(itemInput.id);
        existingItemIds.delete(itemInput.id);
      } else {
        // create new data
        const newItem = orderItemRepo.create({
          product: { id: itemInput.product.id },
          quantity: itemInput.quantity,
          unitPrice: itemInput.unitPrice,
          total: itemInput.total,
        });
        await orderItemRepo.save(newItem);
        updatedOrderItems.push(newItem.id);
      }
    }

    // remove item
    for (const unusedItemId of existingItemIds) {
      await orderItemRepo.delete(unusedItemId!);
    }

    const orderData = {
      ...data,
      customer: data.customer.id,
      items: updatedOrderItems,
    };

    const parse = UpdateOrderSchema.safeParse(orderData);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }

    const { items, customer, ...rest } = parse.data;
    const updateData: CreateOrderInput = {
      ...rest,
      deliveryDate: rest.deliveryDate ? new Date(rest.deliveryDate) : undefined,
      customer,
      items,
      shippingFee: rest.shippingFee,
      tax: rest.tax,
    };

    const updated = await updateOrder(params.id, updateData);

    if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const result = await deleteOrder(params.id);
    if (!result.affected) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 