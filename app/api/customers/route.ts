import { NextRequest, NextResponse } from "next/server";
import { getAllCustomers, createCustomer } from "@/lib/services/customerService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CreateCustomerSchema } from "./customer.schema";
import { CustomerEntity } from "@/lib/database/entities/customer.entity";
import { getUserFromRequest } from "@/lib/auth/jwt";

/**
 * @swagger
 * components:
 *   schemas:
 *     MutateCustomerRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         company:
 *           type: string
 *         location:
 *           type: string
 *         lastOrder:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [active, inactive, pending]
 *         customerType:
 *           type: string
 *           enum: [vip, premium, regular]
 *         joinDate:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 * 
 *     CustomerResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         company:
 *           type: string
 *         location:
 *           type: string
 *         lastOrder:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [active, inactive, pending]
 *         customerType:
 *           type: string
 *           enum: [vip, premium, regular]
 *         joinDate:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
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
 *
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customer APIs]
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
 *         name: name
 *         schema: { type: string }
 *         description: Filter by name
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerResponse'
 * 
 *   post:
 *     summary: Create a new customer
 *     tags: [Customer APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MutateCustomerRequest'
 *     responses:
 *       201:
 *         description: Customer created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerResponse'
 * 
 */

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const status = searchParams.get("status") || undefined;
    const customerType = searchParams.get("customerType") || undefined;
    const searchTerm = searchParams.get("searchTerm") || undefined;

    const result = await getAllCustomers({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { status, customerType, searchTerm },
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
    const parse = CreateCustomerSchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    // Convert lastOrder and joinDate to Date if present
    const createData = { ...parse.data } as CustomerEntity;
    const created = await createCustomer(createData);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 