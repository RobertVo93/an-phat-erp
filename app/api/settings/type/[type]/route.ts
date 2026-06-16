import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getSettingsByConfigTypeService } from "@/lib/services/settingService";

export async function GET(
    _req: NextRequest,
    { params }: { params: { type: string } }
) {
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
