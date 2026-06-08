import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { getSettingsByConfigTypeService } from "@/lib/services/settingService";

export async function GET(
    req: NextRequest,
    { params }: { params: { type: string } }
) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await ensureDataSource();
        const { type } = await params;
        const settings = await getSettingsByConfigTypeService(decodeURIComponent(type));
        return NextResponse.json(settings);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const status = message === "Setting not found" ? 404 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
