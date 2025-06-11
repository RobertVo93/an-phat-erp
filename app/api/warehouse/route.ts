import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CreateWarehouseSchema } from "./warehouse.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { addWarehouse, getAllWarehouses } from "@/lib/services/warehouseService";

/**
 * @swagger
 * components:
 *   schemas:
 *     MutateWarehouseRequest:
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
 *     WarehouseResponse:
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
 * /api/warehouse:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouse APIs]
 *     responses:
 *       200:
 *         description: List of all warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WarehouseResponse'
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouse APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MutateWarehouseRequest'
 *     responses:
 *       201:
 *         description: Warehouse created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseResponse'
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