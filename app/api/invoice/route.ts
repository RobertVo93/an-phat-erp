import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { InvoiceSchema } from "@/app/api/invoice/invoice.schema";
import { addInvoiceService, getAllInvoicesService } from "@/lib/services/invoiceService";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const searchTerm = searchParams.get("searchTerm") || undefined;
    const status = searchParams.get("status") || undefined;
    const billingPeriod = searchParams.get("billingPeriod") || undefined;
    const dueDateFrom = searchParams.get("dueDateFrom") ? new Date(searchParams.get("dueDateFrom") as string) : undefined;
    const dueDateTo = searchParams.get("dueDateTo") ? new Date(searchParams.get("dueDateTo") as string) : undefined;
    const amountFrom = Number(searchParams.get("amountFrom")) || undefined;
    const amountTo = Number(searchParams.get("amountTo")) || undefined;

    const result = await getAllInvoicesService({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { status, billingPeriod, dueDateFrom, dueDateTo, amountFrom, amountTo, searchTerm },
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

    const parseInvoice = InvoiceSchema.safeParse(data);
    if (!parseInvoice.success) {
      return NextResponse.json({ error: "Invalid input", details: parseInvoice.error.errors }, { status: 400 });
    }

    const added = await addInvoiceService(parseInvoice.data);
    return NextResponse.json(added, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}