import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { UtilitySchema } from "./utility.schema";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { addUtility, getUtilities } from "@/lib/services/utilityService";
import { UtilitySortField, SortDirection} from "@/types";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortField = (searchParams.get("sortField") || "type") as UtilitySortField ;
    const sortDirection = (searchParams.get("sortDirection") || "asc") as SortDirection;
    const searchTerm = searchParams.get("searchTerm") || "";
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;
    const location = searchParams.get("location") || undefined;
    const provider = searchParams.get("provider") || undefined;
    const dueDateFrom = searchParams.get("dueDateFrom") || undefined;
    const dueDateTo = searchParams.get("dueDateTo") || undefined;
    const costFrom = Number(searchParams.get("costFrom")) || 0;
    const costTo = Number(searchParams.get("costTo")) || 0;

    const result = await getUtilities({page, limit, sortField, sortDirection, searchTerm, type, status, location, provider, dueDateFrom, dueDateTo, costFrom, costTo});
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
    const parse = UtilitySchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    const created = await addUtility(parse.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}