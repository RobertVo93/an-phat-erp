import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { getSessionConfig } from "@/lib/auth/session-config";

export const ACCESS_TOKEN_COOKIE = "admin_access_token";

const ACCESS_TOKEN_ISSUER = "anphat-admin";
const ACCESS_TOKEN_AUDIENCE = "anphat-admin-api";

// Standalone on purpose (not jwt.JwtPayload): its index signature would hide typos such as user.id.
export interface IAccessTokenPayload {
  userId: string;
  sid: string; // refresh-token family id, for logs only
  typ: "access";
  iat: number;
  exp: number;
}

export function signAccessToken(userId: string, sessionId: string): { token: string; expiresInSeconds: number } {
  const { accessTokenSecret, accessTokenTtlSeconds } = getSessionConfig();
  if (!accessTokenSecret) {
    throw new Error("AUTH_ACCESS_TOKEN_SECRET is not configured");
  }

  const token = jwt.sign({ userId, sid: sessionId, typ: "access" }, accessTokenSecret, {
    algorithm: "HS256",
    expiresIn: accessTokenTtlSeconds,
    issuer: ACCESS_TOKEN_ISSUER,
    audience: ACCESS_TOKEN_AUDIENCE,
  });
  return { token, expiresInSeconds: accessTokenTtlSeconds };
}

export function verifyAccessToken(token: string): IAccessTokenPayload | null {
  const { accessTokenSecret } = getSessionConfig();
  if (!accessTokenSecret) return null;

  try {
    const payload = jwt.verify(token, accessTokenSecret, {
      algorithms: ["HS256"],
      issuer: ACCESS_TOKEN_ISSUER,
      audience: ACCESS_TOKEN_AUDIENCE,
    });
    if (typeof payload !== "object" || payload === null) return null;
    if (payload.typ !== "access" || typeof payload.userId !== "string" || !payload.userId) return null;

    return {
      userId: payload.userId,
      sid: typeof payload.sid === "string" ? payload.sid : "",
      typ: "access",
      iat: Number(payload.iat),
      exp: Number(payload.exp),
    };
  } catch {
    return null;
  }
}

// Synchronous on purpose: 72 handlers call it without await. Cookie first, then "Authorization: Bearer".
export function getUserFromRequest(req: NextRequest): IAccessTokenPayload | null {
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value ||
    req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) return null;
  return verifyAccessToken(token);
}
