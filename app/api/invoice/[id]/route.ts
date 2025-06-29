import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { InvoiceSchema, UtilityReadingArraySchema } from "../invoice.schema";
import { deleteInvoice, updateInvoice } from "@/lib/services/invoiceService";
import { Invoice, UtilityReading } from "@/types";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const data = await req.json();
    const readings = data.readings

    const parseInvoice = InvoiceSchema.safeParse(data);
    if (!parseInvoice.success) {
      return NextResponse.json({ error: "Invalid input", details: parseInvoice.error.errors }, { status: 400 });
    }

    const parseReadings = UtilityReadingArraySchema.safeParse(readings);
    if (!parseReadings.success) {
      return NextResponse.json({ error: "Invalid input", details: parseReadings.error.errors }, { status: 400 });
    }

    const updated = await updateInvoice(params.id, parseInvoice.data as Invoice, parseReadings.data as UtilityReading[]);
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
    const result = await deleteInvoice(params.id);
    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 