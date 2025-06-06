import { NextRequest, NextResponse } from "next/server";
import { setUserPagePermissions } from "@/lib/services/userPermissionService";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { UserService } from "@/lib/services/user.service";
import { ensureDataSource } from "@/lib/database/ensureDataSource";

export async function GET(req: NextRequest) {
	const user = getUserFromRequest(req);
	if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get("page") || "1");
	const limit = parseInt(searchParams.get("limit") || "10");
	const sortBy = searchParams.get("sortBy") || "createdAt";
	const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
	const search = searchParams.get("search") || "";
	const role = searchParams.get("role") || "";

	try {
    await ensureDataSource();
		const userService = new UserService();
		const skip = (page - 1) * limit;

		// Get users with pagination, sorting and filtering
		const { users, total } = await userService.getUsersWithRelations(search, role, sortBy, sortOrder, skip, limit);

		return NextResponse.json({
			data: users,
			pagination: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = getUserFromRequest(req);
		if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		
    await ensureDataSource();
		const body = await req.json();
		const { userId, permissions } = body;
		if (!userId || !Array.isArray(permissions)) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}
		const result = await setUserPagePermissions(userId, permissions);
		return NextResponse.json(result);
	} catch (error) {
		console.error("Error saving permissions:", error);
		return NextResponse.json({ error: "Failed to save permissions" }, { status: 500 });
	}
} 