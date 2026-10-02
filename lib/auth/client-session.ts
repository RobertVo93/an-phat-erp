import { ADMIN_ROUTES } from "@/constants/nav";
import { getSafeReturnPath, isAuthPagePath, type LoginReason } from "@/lib/auth/return-path";
import type { IAuthSession, ISessionUser } from "@/types";

// Browser-only helpers. Nothing here may touch window/localStorage at module scope:
// lib/httpclient/base.ts (which imports this file) is also loaded by a server route.

export const ADMIN_USER_STORAGE_KEY = "user"; // legacy key, kept (ecom and pos never use it)
export const ADMIN_SESSION_STORAGE_KEY = "admin_session";
export const ADMIN_SESSION_END_STORAGE_KEY = "admin_session_end";

export type SessionEndReason = LoginReason | "logout";

// Local epoch milliseconds computed from the server's relative lifetimes. No secrets.
export interface IClientSessionMeta {
  userId: string;
  accessExpiresAt: number;
  accessTtlMs: number;
  refreshExpiresAt: number;
  refreshedAt: number;
}

export interface ISessionEndMarker {
  reason: SessionEndReason;
  at: number;
}

const SESSION_END_MARKER_MAX_AGE_MS = 60_000;

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

function readJson(key: string): unknown {
  const raw = getStorage()?.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveClientSession(user: ISessionUser, session: IAuthSession): IClientSessionMeta {
  const now = Date.now();
  const meta: IClientSessionMeta = {
    userId: user.id ?? "",
    accessExpiresAt: now + session.accessTokenExpiresIn * 1000,
    accessTtlMs: session.accessTokenExpiresIn * 1000,
    refreshExpiresAt: now + session.refreshTokenExpiresIn * 1000,
    refreshedAt: now,
  };

  const storage = getStorage();
  try {
    storage?.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(user));
    storage?.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(meta));
    storage?.removeItem(ADMIN_SESSION_END_STORAGE_KEY);
  } catch (error) {
    console.error("[auth] Failed to save the session to localStorage", error);
  }
  return meta;
}

export function readClientSession(): IClientSessionMeta | null {
  const value = readJson(ADMIN_SESSION_STORAGE_KEY) as Partial<IClientSessionMeta> | null;
  if (
    !value ||
    typeof value.userId !== "string" ||
    typeof value.accessExpiresAt !== "number" ||
    typeof value.accessTtlMs !== "number" ||
    typeof value.refreshExpiresAt !== "number" ||
    typeof value.refreshedAt !== "number"
  ) {
    return null;
  }
  return value as IClientSessionMeta;
}

export function readSessionEndMarker(): ISessionEndMarker | null {
  const value = readJson(ADMIN_SESSION_END_STORAGE_KEY) as Partial<ISessionEndMarker> | null;
  if (!value || (value.reason !== "session_expired" && value.reason !== "logout") || typeof value.at !== "number") {
    return null;
  }
  return Date.now() - value.at <= SESSION_END_MARKER_MAX_AGE_MS ? (value as ISessionEndMarker) : null;
}

// Writes the end marker first so other tabs know why `user` disappeared.
export function clearClientSession(reason: SessionEndReason): void {
  const storage = getStorage();
  try {
    storage?.setItem(ADMIN_SESSION_END_STORAGE_KEY, JSON.stringify({ reason, at: Date.now() } satisfies ISessionEndMarker));
    storage?.removeItem(ADMIN_SESSION_STORAGE_KEY);
    storage?.removeItem(ADMIN_USER_STORAGE_KEY);
  } catch (error) {
    console.error("[auth] Failed to clear the session from localStorage", error);
  }
}

export function isAccessTokenStale(meta: IClientSessionMeta | null, now: number = Date.now()): boolean {
  if (!meta) return true;
  const skew = Math.min(Math.max(meta.accessTtlMs * 0.1, 5_000), 60_000);
  return now >= meta.accessExpiresAt - skew;
}

export function getCurrentPath(): string {
  return typeof window === "undefined" ? "" : `${window.location.pathname}${window.location.search}`;
}

export function buildLoginHref(opts: { reason?: LoginReason | null; next?: string | null } = {}): string {
  const params = new URLSearchParams();
  if (opts.reason) params.set("reason", opts.reason);
  const next = getSafeReturnPath(opts.next);
  if (next) params.set("next", next);
  const query = params.toString();
  return ADMIN_ROUTES.login(query || undefined);
}

export function redirectToLogin(reason?: LoginReason): void {
  clearClientSession(reason ?? "logout");
  if (typeof window === "undefined" || isAuthPagePath(window.location.pathname)) return;
  window.location.replace(buildLoginHref({ reason, next: getCurrentPath() }));
}
