import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/services/productService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CreateProductSchema } from "./product.schema";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         cost:
 *           type: number
 *         stock:
 *           type: number
 *         minStock:
 *           type: number
 *         sku:
 *           type: string
 *         barcode:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, lowStock, outOfStock]
 *         supplier:
 *           type: string
 *         image:
 *           type: string
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         cost:
 *           type: number
 *         stock:
 *           type: number
 *         minStock:
 *           type: number
 *         sku:
 *           type: string
 *         barcode:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, lowStock, outOfStock]
 *         supplier:
 *           type: string
 *         image:
 *           type: string
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: number
 *         cost:
 *           type: number
 *         stock:
 *           type: number
 *         minStock:
 *           type: number
 *         sku:
 *           type: string
 *         barcode:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive, lowStock, outOfStock]
 *         supplier:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date
 *           nullable: true
 *         updatedAt:
 *           type: string
 *           format: date
 *           nullable: true
 *
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Product APIs]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponse'
 *   post:
 *     summary: Create a new product
 *     tags: [Product APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 */


export async function GET() {
  try {
    await ensureDataSource();
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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