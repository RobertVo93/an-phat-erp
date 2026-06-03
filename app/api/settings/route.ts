import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { getSettingsService } from "@/lib/services/settingService";

export async function GET(req: NextRequest) {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await ensureDataSource();
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrderParam = searchParams.get("sortOrder");
        const sortOrder = sortOrderParam === "asc" ? "asc" : "desc";
        const configType = searchParams.get("configType") || undefined;
        const key = searchParams.get("key") || undefined;
        const searchTerm = searchParams.get("searchTerm") || undefined;

        const result = await getSettingsService({
            page,
            limit,
            sortBy,
            sortOrder,
            configType,
            key,
            searchTerm,
        });
        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
