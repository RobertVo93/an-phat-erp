import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET || "dev_secret"; // TODO: Use env var in production

export function signJwt(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d", ...options });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

// Extract user from JWT in cookies or Authorization header
export function getUserFromRequest(req: NextRequest): any {
  // Try cookie first
  const token = req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) return null;
  return verifyJwt(token);
} 