import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, createOrderService } from "@/lib/services/orderService";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { CreateOrderSchema } from "@/app/api/orders/order.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { OrderEntity } from "@/lib/database/entities";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId") || undefined
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "deliveryDate";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const status = searchParams.get("status") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const paymentMethod = searchParams.get("paymentMethod") || undefined;
    const customer = searchParams.get("customer") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;
    const totalAmountFromParam = searchParams.get("totalAmountFrom");
    const totalAmountToParam = searchParams.get("totalAmountTo");
    const totalAmountFrom = totalAmountFromParam ? Number(totalAmountFromParam) : undefined;
    const totalAmountTo = totalAmountToParam ? Number(totalAmountToParam) : undefined;
    const searchTerm = searchParams.get("searchTerm") || undefined;

    const result = await getAllOrders({
      customerId,
      page,
      limit,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
      filters: { status, customer, dateFrom, dateTo, searchTerm, paymentStatus, paymentMethod, totalAmountFrom, totalAmountTo },
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

    const parseData = CreateOrderSchema.safeParse(data);
    if (!parseData.success) {
      return NextResponse.json({ error: "Invalid input", details: parseData.error.errors }, { status: 400 });
    }
    const created = await createOrderService(parseData.data as OrderEntity);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
