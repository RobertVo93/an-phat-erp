import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/services/productService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CreateProductSchema } from "./product.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           description: Product selling price
 *         cost:
 *           type: number
 *           description: Product cost price
 *         stock:
 *           type: number
 *           description: Current stock quantity
 *         minStock:
 *           type: number
 *           description: Minimum stock threshold
 *         sku:
 *           type: string
 *           description: Stock keeping unit
 *         barcode:
 *           type: string
 *           description: Product barcode
 *         status:
 *           type: string
 *           enum: [active, inactive, lowStock, outOfStock]
 *           description: Product status
 *         supplier:
 *           type: string
 *           description: Product supplier
 *         image:
 *           type: string
 *           description: Product image URL
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           description: Product selling price
 *         cost:
 *           type: number
 *           description: Product cost price
 *         stock:
 *           type: number
 *           description: Current stock quantity
 *         minStock:
 *           type: number
 *           description: Minimum stock threshold
 *         sku:
 *           type: string
 *           description: Stock keeping unit
 *         barcode:
 *           type: string
 *           description: Product barcode
 *         status:
 *           type: string
 *           enum: [active, inactive, lowStock, outOfStock]
 *           description: Product status
 *         supplier:
 *           type: string
 *           description: Product supplier
 *         image:
 *           type: string
 *           description: Product image URL
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique product identifier
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           description: Product selling price
 *         cost:
 *           type: number
 *           description: Product cost price
 *         stock:
 *           type: number
 *           description: Current stock quantity
 *         minStock:
 *           type: number
 *           description: Minimum stock threshold
 *         sku:
 *           type: string
 *           description: Stock keeping unit
 *         barcode:
 *           type: string
 *           description: Product barcode
 *         status:
 *           type: string
 *           enum: [active, inactive, lowStock, outOfStock]
 *           description: Product status
 *         supplier:
 *           type: string
 *           description: Product supplier
 *         image:
 *           type: string
 *           description: Product image URL
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           nullable: true
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           nullable: true
 *
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a paginated list of products with optional filtering and sorting
 *     tags: [Product APIs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, lowStock, outOfStock]
 *         description: Filter by product status
 *       - in: query
 *         name: supplier
 *         schema:
 *           type: string
 *         description: Filter by supplier
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, description, SKU, and barcode
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductResponse'
 *                 total:
 *                   type: integer
 *                   description: Total number of products
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided details
 *     tags: [Product APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrderParam = searchParams.get("sortOrder");
    const sortOrder = sortOrderParam === "asc" || sortOrderParam === "desc" ? sortOrderParam : "desc";
    const name = searchParams.get("name") || undefined;
    const status = searchParams.get("status") || undefined;
    const supplier = searchParams.get("supplier") || undefined;
    const search = searchParams.get("search") || undefined;

    const result = await getAllProducts({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { name, status, supplier, search },
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
    const parse = CreateProductSchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    const created = await createProduct(parse.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}