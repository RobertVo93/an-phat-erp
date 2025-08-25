import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { ProductionSchema } from "../production.schema";
import { deleteProduction, updateProduction } from "@/lib/services/productionService";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const data = await req.json();

    const parseData = ProductionSchema.safeParse(data);
    if (!parseData.success) {
      return NextResponse.json({ error: "Invalid input", details: parseData.error.errors }, { status: 400 });
    }

    const { id } = await params;
    const updated = await updateProduction(
      id,
      parseData.data,
      parseData.data.materials || [],
      parseData.data.utilities || [],
      parseData.data.labors || []
    );
    if (!updated!) return NextResponse.json({ error: "Production cannot be updated" }, { status: 400 });

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
    const result = await deleteProduction(id);
    if (!result) return NextResponse.json({ error: "Production cannot be deleted" }, { status: 400 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 