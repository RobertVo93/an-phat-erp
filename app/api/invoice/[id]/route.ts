import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { InvoiceSchema } from "@/app/api/invoice/invoice.schema";
import { deleteInvoiceService, updateInvoiceService } from "@/lib/services/invoiceService";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const data = await req.json();

    const parseInvoice = InvoiceSchema.safeParse(data);
    if (!parseInvoice.success) {
      return NextResponse.json({ error: "Invalid input", details: parseInvoice.error.errors }, { status: 400 });
    }
    const { id } = await params;
    const updated = await updateInvoiceService(id, parseInvoice.data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { id } = await params;
    const result = await deleteInvoiceService(id);
    if (!result) {
      return NextResponse.json({ error: "Cannot delete invoice" }, { status: 400 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 