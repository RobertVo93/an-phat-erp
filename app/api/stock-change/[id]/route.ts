import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { StockProductArraySchema, UpdateStockChangeSchema } from "../stockChange.schema";
import { deleteStockChange, getStockChangeById, updateStockChange } from "@/lib/services/stockChangeService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    await ensureDataSource()
    const { id } = await params
    const result = await getStockChangeById(id)
    if (!result) return NextResponse.json({ error: "Stock-change not found" }, { status: 404 })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const data = await req.json();
    const stockProducts = data.stockProducts

    const parseData = UpdateStockChangeSchema.safeParse(data);
    if (!parseData.success) {
      return NextResponse.json({ error: "Invalid input", details: parseData.error.errors }, { status: 400 });
    }

    const parseStockProducts = StockProductArraySchema.safeParse(stockProducts)
    if (!parseStockProducts.success) {
      return NextResponse.json({ error: "Invalid input", details: parseStockProducts.error.errors }, { status: 400 });
    }
    const { id } = await params;
    const updated = await updateStockChange(id, parseData.data, parseStockProducts.data);
    if (!updated!) return NextResponse.json({ error: "Stock-change not found" }, { status: 404 });

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
    const { id } = await params;
    const result = await deleteStockChange(id);
    if (!result) return NextResponse.json({ error: "Cannot delete the record" }, { status: 400 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 
