import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { getActivityLogsByTargetIdService } from "@/lib/services/activityLogService";
import { ResourceType } from "@/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { id } = await params;
    const activityLogs = await getActivityLogsByTargetIdService(ResourceType.order, id);
    if (!activityLogs) return NextResponse.json({ error: "Activity Logs not found" }, { status: 404 });
    return NextResponse.json(activityLogs);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}