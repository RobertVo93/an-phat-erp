import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CreateStockChangeSchema, StockProductArraySchema } from "./stockChange.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { addStockChange, getAllStockChanges } from "@/lib/services/stockChangeService";


export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const result = await getAllStockChanges()
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
    const stockProducts = data.stockProducts
    
    const parseData = CreateStockChangeSchema.safeParse(data);
    if (!parseData.success) {
      return NextResponse.json({ error: "Invalid input", details: parseData.error.errors }, { status: 400 });
    }

    const parseStockProducts = StockProductArraySchema.safeParse(stockProducts)
    if (!parseStockProducts.success) {
      return NextResponse.json({ error: "Invalid input", details: parseStockProducts.error.errors }, { status: 400 });
    }

    try {
      const created = await addStockChange(parseData.data, parseStockProducts.data);
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 