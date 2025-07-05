import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { ProductionSchema, ProductionMaterialArraySchema, ProductionUtilityArraySchema, ProductionLaborArraySchema } from "./production.schema";
import { createProductionRecord, getAllProductionRecords } from "@/lib/services/productionService";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const result = await getAllProductionRecords()
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

    const parseProductionMaterials = ProductionMaterialArraySchema.safeParse(data.productionMaterials);
    if (!parseProductionMaterials.success) {
      return NextResponse.json({ error: "Invalid input", details: parseProductionMaterials.error.errors }, { status: 400 });
    }

    const parseProductionUtilities = ProductionUtilityArraySchema.safeParse(data.productionUtilities);
    if (!parseProductionUtilities.success) {
      return NextResponse.json({ error: "Invalid input", details: parseProductionUtilities.error.errors }, { status: 400 });
    }

    const parseProductionLabors = ProductionLaborArraySchema.safeParse(data.productionLabors);
    if (!parseProductionLabors.success) {
      return NextResponse.json({ error: "Invalid input", details: parseProductionLabors.error.errors }, { status: 400 });
    }

    try {
      const created = await createProductionRecord(
        parseData.data,
        parseProductionMaterials.data,
        parseProductionUtilities.data,
        parseProductionLabors.data
      );
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
} 