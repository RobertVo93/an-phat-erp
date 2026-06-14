import { NextRequest } from "next/server";

export function getPublicOrigin(req: NextRequest): string {
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();

  if (forwardedHost) {
    return `${forwardedProto || req.nextUrl.protocol.replace(/:$/u, "")}://${forwardedHost}`;
  }

  return req.nextUrl.origin;
}
