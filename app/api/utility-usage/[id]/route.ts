import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { UpdateUtilityUsageSchema } from "@/app/api/utility-usage/utility-usage.schema";
import {
  deleteUtilityUsageService,
  getUtilityUsageByIdOrNumberService,
  updateUtilityUsageService,
} from "@/lib/services/utilityUsageService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const { id } = await params;
    const record = await getUtilityUsageByIdOrNumberService(id);

    if (!record) {
      return NextResponse.json({ error: "Utility usage not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const data = await req.json();
    const parse = UpdateUtilityUsageSchema.safeParse(data);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }

    const { id } = await params;
    const updated = await updateUtilityUsageService(id, {
      ...parse.data,
      updatedBy: user.id || user.username,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const { id } = await params;
    const result = await deleteUtilityUsageService(id);

    if (!result) {
      return NextResponse.json({ error: "Cannot delete utility usage" }, { status: 400 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
