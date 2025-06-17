import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { ProductionMaterialArraySchema, ProductionSchema } from "../production.schema";
import { updateProduction } from "@/lib/services/productionService";


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

    const parseProductionMaterials = ProductionMaterialArraySchema.safeParse(data.productionMaterials);
    if (!parseProductionMaterials.success) {
      return NextResponse.json({ error: "Invalid input", details: parseProductionMaterials.error.errors }, { status: 400 });
    }

    const updated = await updateProduction(params.id, parseData.data, parseProductionMaterials.data);
    if (!updated!) return NextResponse.json({ error: "Stock-change not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   const user = getUserFromRequest(req);
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   try {
//     await ensureDataSource();
//     const result = await deleteStockChange(params.id);
//     if (!result.affected) return NextResponse.json({ error: "Stock-change not found" }, { status: 404 });
//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
//   }
// } 