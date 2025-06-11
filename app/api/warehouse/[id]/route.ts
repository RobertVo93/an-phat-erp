import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { UpdateWarehouseSchema } from "../warehouse.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { deleteWarehouse, updateWarehouse } from "@/lib/services/warehouseService";

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

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   const user = getUserFromRequest(req);
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   try {
//     await ensureDataSource();
//     const order = await getOrderById(params.id);
//     if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
//     return NextResponse.json(order);
//   } catch (error) {
//     return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
//   }
// }

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const data = await req.json();
    const parse = UpdateWarehouseSchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }

    const updated = await updateWarehouse(params.id, parse.data);
    if (!updated) return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });

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
    const result = await deleteWarehouse(params.id);
    if (!result.affected) return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 