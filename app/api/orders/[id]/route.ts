import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrder, deleteOrder } from "@/lib/services/orderService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { UpdateOrderSchema } from "../order.schema";
import { OrderEntity } from "@/lib/database/entities/order.entity";

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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDataSource();
    const order = await getOrderById(params.id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDataSource();
    const data = await req.json();
    const parse = UpdateOrderSchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    const updateData = {
      ...parse.data,
      deliveryDate: parse.data.deliveryDate ? new Date(parse.data.deliveryDate) : undefined,
    };
    const updated = await updateOrder(params.id, updateData);
    if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDataSource();
    const result = await deleteOrder(params.id);
    if (!result.affected) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 