import { NextRequest, NextResponse } from "next/server";
import { getCollectionById, updateCollection, deleteCollection } from "@/lib/services/collectionService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CollectionSchema } from "../collection.schema";

/**
 * @swagger
 * /api/collections/{id}:
 *   get:
 *     summary: Get a collection by ID
 *     tags: [Collection APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Collection found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionResponse'
 * 
 *   put:
 *     summary: Update a collection
 *     tags: [Collection APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCollectionRequest'
 *     responses:
 *       200:
 *         description: Collection updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CollectionResponse'
 * 
 *   delete:
 *     summary: Delete a collection
 *     tags: [Collection APIs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Collection deleted
 *       404:
 *         description: Collection not found
 */


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDataSource();
    const collection = await getCollectionById(params.id);
    if (!collection) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDataSource();
    const data = await req.json();
    const parse = CollectionSchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    const updated = await updateCollection(params.id, parse.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDataSource();
    const result = await deleteCollection(params.id);
    if (result.affected === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 