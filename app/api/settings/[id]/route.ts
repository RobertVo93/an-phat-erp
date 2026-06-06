import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { UpdateSettingSchema } from "@/app/api/settings/setting.schema";
import { updateSettingService } from "@/lib/services/settingService";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await ensureDataSource();
        const data = await req.json();
        const parse = UpdateSettingSchema.safeParse(data);
        if (!parse.success) {
            return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
        }

        const { id } = await params;
        const updated = await updateSettingService(id, parse.data);
        return NextResponse.json(updated);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const status = message === "Setting not found" ? 404 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}
