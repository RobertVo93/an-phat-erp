import { NextRequest, NextResponse } from "next/server";
import { getAllCollections, createCollection } from "@/lib/services/collectionService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CollectionSchema } from "./collection.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";

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
 *         saleable:
 *           type: boolean
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
 *         saleable:
 *           type: boolean
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
 *         saleable:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date
 *           nullable: true
 *         created_by:
 *           type: string
 *         updated_at:
 *           type: string
 *           format: date
 *           nullable: true
 *         updated_by:
 *           type: string
 *           nullable: true
 *
 *     CollectionsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CollectionResponse'
 *         total:
 *           type: number
 *         page:
 *           type: number
 *         limit:
 *           type: number
 *
 * @swagger
 * /api/collections:
 *   get:
 *     summary: Get all collections
 *     tags: [Collection APIs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, draft, archived]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [fashion, electronics, home, office]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of collections with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionsResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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
 *       400:
 *         description: Invalid input
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
    const limit = Number(searchParams.get("limit")) || 1000;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrderParam = searchParams.get("sortOrder");
    const sortOrder = sortOrderParam === "asc" || sortOrderParam === "desc" ? sortOrderParam : "desc";
    const name = searchParams.get("name") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const result = await getAllCollections({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { name, status, search },
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
