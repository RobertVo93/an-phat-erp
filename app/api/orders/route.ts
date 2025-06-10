import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, createOrder, type CreateOrderInput } from "@/lib/services/orderService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CreateOrderSchema } from "./order.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { OrderItemEntity } from "@/lib/database/entities";
import { AppDataSource } from "@/lib/database/typeorm";

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
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status") || undefined;
    const customer = searchParams.get("customer") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    const result = await getAllOrders({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { status, customer, dateFrom, dateTo },
    });
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

    const orderItemRepo = AppDataSource.getRepository(OrderItemEntity);
    const createdOrderItems = [];
    for (const itemInput of data.items) {
      const orderItem = orderItemRepo.create({
        product: { id: itemInput.product.id },
        quantity: itemInput.quantity,
        unitPrice: itemInput.unitPrice,
        total: itemInput.total,
      });
      await orderItemRepo.save(orderItem);
      createdOrderItems.push(orderItem);
    }

    const orderData = {
      ...data,
      customer: data.customer.id,
      items: createdOrderItems.map(item => item.id),
    };

    const parse = CreateOrderSchema.safeParse(orderData);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    const { items, customer, ...rest } = parse.data;
    const createData: CreateOrderInput = {
      ...rest,
      deliveryDate: rest.deliveryDate ? new Date(rest.deliveryDate) : undefined,
      customer,
      items,
      shippingFee: rest.shippingFee,
      tax: rest.tax
    };
    try {
      const created = await createOrder(createData);
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 