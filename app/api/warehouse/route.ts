import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CreateWarehouseSchema } from "./warehouse.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { addWarehouse, getAllWarehouses } from "@/lib/services/warehouseService";

/**
 * @swagger
 * components:
 *   schemas:
 *     MutateOrderRequest:
 *       type: object
 *       properties:
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, completed, cancelled]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, partial, failed, refunded]
 *         paymentMethod:
 *           type: string
 *           enum: [cash, creditCard, debitCard, bankTransfer, paypal]
 *         shippingAddress:
 *           type: string
 *         notes:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         customer:
 *           type: object
 *         items:
 *           type: array
 *           items:
 *             type: object
 * 
 *     OrderResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, completed, cancelled]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, partial, failed, refunded]
 *         paymentMethod:
 *           type: string
 *           enum: [cash, creditCard, debitCard, bankTransfer, paypal]
 *         shippingAddress:
 *           type: string
 *         notes:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         customer:
 *           type: object
 *         items:
 *           type: array
 *           items:
 *             type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *         updatedBy:
 *           type: string
 * 
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Order APIs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *         description: Sort order
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *         description: Filter by status
 *       - in: query
 *         name: customer
 *         schema: { type: string }
 *         description: Filter by customer
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date-time }
 *         description: Filter by start date
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date-time }
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderResponse'
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *   post:
 *     summary: Create a new order
 *     tags: [Order APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MutateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 */

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const result = await getAllWarehouses()
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const data = await req.json();
    
    const parse = CreateWarehouseSchema.safeParse(data);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }

    try {
      const created = await addWarehouse(parse.data);
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 