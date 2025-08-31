import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { approvePayrollService, deletePayrollService } from "@/lib/services/payrollService";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    
    const {id} = await params;
    const updated = await approvePayrollService(id);

    if (!updated) return NextResponse.json({ error: "Payroll cannot be approved" }, { status: 400 });
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
    const {id} = await params;
    const result = await deletePayrollService(id);
    if (!result) return NextResponse.json({ error: "Payroll cannot be deleted" }, { status: 400 });
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}