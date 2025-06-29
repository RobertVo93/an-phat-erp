import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { InvoiceSchema, UtilityReadingArraySchema } from "./invoice.schema";
import { addInvoice, getAllInvoices } from "@/lib/services/invoiceService";
import { Invoice, UtilityReading } from "@/types";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const result = await getAllInvoices();
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
    const readings = data.readings

    const parseInvoice = InvoiceSchema.safeParse(data);
    if (!parseInvoice.success) {
      return NextResponse.json({ error: "Invalid input", details: parseInvoice.error.errors }, { status: 400 });
    }

    const parseReadings = UtilityReadingArraySchema.safeParse(readings);
    if (!parseReadings.success) {
      return NextResponse.json({ error: "Invalid input", details: parseReadings.error.errors }, { status: 400 });
    }

    const added = await addInvoice(parseInvoice.data as Invoice, parseReadings.data as UtilityReading[]);
    return NextResponse.json(added, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}