import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { getProductInWarehouseByFilters } from "@/lib/services/warehouseService";

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
    const warehouseId = searchParams.get("warehouseId") || undefined;
    const productId = searchParams.get("productId") || undefined;
    const searchTerm = searchParams.get("searchTerm") || undefined;

    const result = await getProductInWarehouseByFilters({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { status, warehouseId, productId, searchTerm },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}