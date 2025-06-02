import { NextRequest, NextResponse } from "next/server";
import { getAllCollections, createCollection } from "@/lib/services/collectionService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CollectionSchema } from "./collection.schema";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCollectionRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, draft, archived]
 *         category:
 *           type: string
 *           enum: [fashion, electronics, home, office]
 *         image:
 *           type: string
 * 
 *     UpdateCollectionRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, draft, archived]
 *         category:
 *           type: string
 *           enum: [fashion, electronics, home, office]
 *         image:
 *           type: string
 * 
 *     CollectionResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, draft, archived]
 *         category:
 *           type: string
 *           enum: [fashion, electronics, home, office]
 *         image:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date
 *           nullable: true
 *         createdBy:
 *           type: string
 *         updatedAt:
 *           type: string
 *           format: date
 *           nullable: true
 *         updatedBy:
 *           type: string
 *           nullable: true
 *
 * @swagger
 * /api/collections:
 *   get:
 *     summary: Get all collections
 *     tags: [Collection APIs]
 *     responses:
 *       200:
 *         description: List of collections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CollectionResponse'
 *   post:
 *     summary: Create a new collection
 *     tags: [Collection APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCollectionRequest'
 *     responses:
 *       201:
 *         description: Collection created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionResponse'

 */


export async function GET() {
  try {
    await ensureDataSource();
    const collections = await getAllCollections();
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDataSource();
    const data = await req.json();
    const parse = CollectionSchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    const created = await createCollection(parse.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 