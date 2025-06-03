import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/auth/jwt";
import { UserService } from "@/lib/services/user.service";
import { UserRole } from "@/types/enums";

export async function POST(req: NextRequest) {
    try {
        const userService = new UserService();
        const { username, email, password } = await req.json();

        // Check if user already exists
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        // Create new user
        const user = await userService.createUser({
            email,
            password,
            username,
            role: UserRole.staff,
        });

        // Generate JWT token
        const token = signJwt({ userId: user.id });

        // Set cookie and return response
        const res = NextResponse.json({ success: true });

        res.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            sameSite: "lax"
        });

        return res;
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}