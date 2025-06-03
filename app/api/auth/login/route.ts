import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/auth/jwt";
import { UserService } from "@/lib/services/user.service";

export async function POST(req: NextRequest) {
    try {
        const userService = new UserService();
        const { email, password } = await req.json();
        const user = await userService.verifyUser(email, password);
        if (!user) {
            return NextResponse.json({ error: "Email or password is incorrect" }, { status: 401 });
        }
        const token = signJwt({ userId: user.id });
        const res = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                active: user.active,
                lastLogin: user.lastLogin,
            }
        });
        res.cookies.set("token", token, { httpOnly: true, path: "/", sameSite: "lax" });
        return res;
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }
} 