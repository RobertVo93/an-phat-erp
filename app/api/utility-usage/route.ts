import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { UtilityUsageSchema } from "@/app/api/utility-usage/utility-usage.schema";
import { addUtilityUsageService, getUtilityUsagesService } from "@/lib/services/utilityUsageService";

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
    const utilityId = searchParams.get("utilityId") || undefined;
    const recorderId = searchParams.get("recorderId") || undefined;
    const approverId = searchParams.get("approverId") || undefined;
    const periodStart = searchParams.get("periodStart")
      ? new Date(searchParams.get("periodStart") as string)
      : undefined;
    const periodEnd = searchParams.get("periodEnd")
      ? new Date(searchParams.get("periodEnd") as string)
      : undefined;

    const result = await getUtilityUsagesService({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { status, utilityId, recorderId, approverId, periodStart, periodEnd, searchTerm },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const data = await req.json();
    const parse = UtilityUsageSchema.safeParse(data);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }

    const created = await addUtilityUsageService({
      ...parse.data,
      createdBy: user.id || user.username,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
