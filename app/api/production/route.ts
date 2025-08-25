import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { ProductionSchema } from "@/app/api/production/production.schema";
import { createProductionRecord, getAllProductionRecords } from "@/lib/services/productionService";

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
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const product = searchParams.get("product") || undefined;
    const searchTerm = searchParams.get("searchTerm") || undefined;
    const result = await getAllProductionRecords({ page, limit, sortBy, sortOrder, filters: { status, dateFrom, dateTo, searchTerm, product } })
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

    const parseData = ProductionSchema.safeParse(data);
    if (!parseData.success) {
      return NextResponse.json({ error: "Invalid input", details: parseData.error.errors }, { status: 400 });
    }

    try {
      const created = await createProductionRecord(
        parseData.data,
        parseData.data.materials || [],
        parseData.data.utilities || [],
        parseData.data.labors || []
      );
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 