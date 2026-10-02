import { getAdminBasePath } from "@/constants";
import { AUTH_REQUEST_HEADER, AUTH_REQUEST_HEADER_VALUE } from "@/lib/auth/auth-request";
import {
  isAccessTokenStale,
  readClientSession,
  redirectToLogin,
  saveClientSession,
} from "@/lib/auth/client-session";
import type { IAuthSessionResponse } from "@/types";

export function apiHref(path: string): string {
  const base = getAdminBasePath();
  const normalizedPath = `/${path.replace(/^\/+/u, "")}`;
  return `${base}${normalizedPath}`.replace(/\/{2,}/gu, "/");
}

export function createApiUrl(path: string): URL {
  return new URL(apiHref(path), window.location.origin);
}

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// Session refresh. Browser-only; no window/navigator/localStorage access at module scope
// (this file is also imported by app/api/upload-url through lib/s3.ts).
// ---------------------------------------------------------------------------

export type RefreshOutcome = "refreshed" | "expired" | "failed";
type RefreshTrigger = "unauthorized" | "stale" | "resume" | "bootstrap" | "timer";

const REFRESH_LOCK_NAME = "admin_auth_refresh";
const LOCK_WAIT_TIMEOUT_MS = 20_000;
const FAILURE_BACKOFF_MS = 10_000;
const UNAUTHORIZED_BREAKER_MS = 60_000;

let sessionGeneration = 0;
let sessionEnded = false;
let lastFailureAt = 0;
let unauthorizedBreakerUntil = 0;
let breakerLogged = false;
let inFlightRefresh: Promise<RefreshOutcome> | null = null;
const refreshListeners = new Set<(data: IAuthSessionResponse) => void>();

export function authRequestHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return { ...headers, [AUTH_REQUEST_HEADER]: AUTH_REQUEST_HEADER_VALUE };
}

function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function getLockManager(): LockManager | null {
  return typeof navigator !== "undefined" && navigator.locks ? navigator.locks : null;
}

// Authenticated admin API = same origin, under <base>/api/, but not <base>/api/auth/ (login, refresh, ...).
function isProtectedApiUrl(input: string | URL): boolean {
  if (typeof window === "undefined") return false;
  let url: URL;
  try {
    url = new URL(String(input), window.location.origin);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  return url.pathname.startsWith(apiHref("/api/")) && !url.pathname.startsWith(apiHref("/api/auth/"));
}

export function markSessionStarted(): void {
  sessionGeneration += 1;
  sessionEnded = false;
  lastFailureAt = 0;
  unauthorizedBreakerUntil = 0;
  breakerLogged = false;
}

export function markSessionEnded(): void {
  sessionGeneration += 1;
  sessionEnded = true;
}

export function onSessionRefreshed(listener: (data: IAuthSessionResponse) => void): () => void {
  refreshListeners.add(listener);
  return () => {
    refreshListeners.delete(listener);
  };
}

export async function waitForPendingRefresh(): Promise<void> {
  if (inFlightRefresh) await inFlightRefresh;
}

// Cross-tab mutex for refresh, login and logout. A frozen tab cannot block the others for more than 20 s,
// and browsers without Web Locks (plain http other than localhost) simply run without it.
export async function withAuthLock<T>(fn: () => Promise<T>): Promise<T> {
  const locks = getLockManager();
  if (!locks) return fn();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LOCK_WAIT_TIMEOUT_MS);
  let started = false;
  try {
    return await locks.request(REFRESH_LOCK_NAME, { signal: controller.signal }, async () => {
      started = true;
      clearTimeout(timer);
      return fn();
    });
  } catch (error) {
    clearTimeout(timer);
    if (started) throw error;
    return fn();
  }
}

async function readJsonBody(res: Response): Promise<{ code?: string; error?: string }> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

async function runRefresh(trigger: RefreshTrigger, startedAt: number, generation: number): Promise<RefreshOutcome> {
  return withAuthLock(async () => {
    // Another tab may have refreshed while this one waited for the lock.
    const meta = readClientSession();
    if (meta && trigger !== "bootstrap") {
      if (trigger === "unauthorized" ? meta.refreshedAt > startedAt : !isAccessTokenStale(meta)) {
        return "refreshed";
      }
    }

    let res: Response;
    try {
      // No client-side timeout: aborting a rotating refresh would lose its new cookie.
      res = await fetch(apiHref("/api/auth/refresh"), {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: authRequestHeaders(),
      });
    } catch (error) {
      lastFailureAt = Date.now();
      console.warn("[auth] Session refresh request failed", error);
      return "failed";
    }

    // A login or logout happened in this tab meanwhile: the result belongs to an older session.
    if (generation !== sessionGeneration) return "failed";

    if (res.ok) {
      const data = (await res.json()) as IAuthSessionResponse;
      saveClientSession(data.user, data.session);
      refreshListeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error("[auth] Session refresh listener failed", error);
        }
      });
      return "refreshed";
    }

    const body = await readJsonBody(res);
    if (res.status === 401) {
      // Another tab logged in or refreshed after this attempt started: its cookies are already in the jar.
      const latest = readClientSession();
      if (latest && latest.refreshedAt > startedAt) return "refreshed";

      if (body.code === "missing" && meta) {
        console.error(
          "[auth] The refresh cookie was not sent. Check AUTH_COOKIE_SECURE (Secure cookies over http) and NEXT_PUBLIC_BASE_ZONE (cookie Path)."
        );
      }
      markSessionEnded();
      redirectToLogin("session_expired");
      return "expired";
    }

    if (res.status === 403 && body.code === "cross_site") {
      console.error("[auth] Session refresh was blocked by the same-origin guard; check the proxy forwards the X-Admin-Auth header.");
    }
    // 5xx, 403, bad gateway...: transient. Only a 401 from /refresh ever ends a session.
    lastFailureAt = Date.now();
    return "failed";
  });
}

// Single flight per tab; never rejects.
export function refreshSession(trigger: RefreshTrigger, requestStartedAt?: number): Promise<RefreshOutcome> {
  if (typeof window === "undefined") return Promise.resolve("failed");
  if (sessionEnded) return Promise.resolve("expired");
  if (Date.now() - lastFailureAt < FAILURE_BACKOFF_MS) return Promise.resolve("failed");
  if (inFlightRefresh) return inFlightRefresh;

  const startedAt = requestStartedAt ?? Date.now();
  const generation = sessionGeneration;
  const refresh: Promise<RefreshOutcome> = runRefresh(trigger, startedAt, generation)
    .catch((error) => {
      lastFailureAt = Date.now();
      console.error("[auth] Session refresh failed", error);
      return "failed" as const;
    })
    .finally(() => {
      if (inFlightRefresh === refresh) inFlightRefresh = null;
    });
  inFlightRefresh = refresh;
  return refresh;
}

/**
 * fetch() for authenticated admin API routes: refreshes a stale or expired access token
 * (once per tab, shared across tabs) and retries the request once after a 401.
 * Auth endpoints, cross-origin and non-API URLs go straight to fetch().
 */
export async function apiFetch(input: string | URL, init?: RequestInit): Promise<Response> {
  if (!isProtectedApiUrl(input)) return fetch(input, init);
  if (sessionEnded) return unauthorizedResponse();

  if (isAccessTokenStale(readClientSession())) {
    const outcome = await refreshSession("stale");
    if (outcome === "expired" || sessionEnded) return unauthorizedResponse();
  }

  const requestInit: RequestInit = { credentials: "include", ...init };
  const startedAt = Date.now();
  const res = await fetch(input, requestInit);
  if (res.status !== 401 || Date.now() < unauthorizedBreakerUntil) return res;

  const outcome = await refreshSession("unauthorized", startedAt);
  if (outcome !== "refreshed") return res;

  const retry = await fetch(input, requestInit);
  if (retry.status === 401) {
    unauthorizedBreakerUntil = Date.now() + UNAUTHORIZED_BREAKER_MS;
    if (!breakerLogged) {
      breakerLogged = true;
      console.error(
        "[auth] A request was still unauthorized after a successful refresh. Check AUTH_COOKIE_SECURE and NEXT_PUBLIC_BASE_ZONE (cookie Path)."
      );
    }
  }
  return retry;
}
