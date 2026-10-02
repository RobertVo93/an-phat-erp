import { ADMIN_ROUTES, getAdminBasePath } from "@/constants/nav";

export type LoginReason = "session_expired";

const MAX_RETURN_PATH_LENGTH = 2048;
const RETURN_PATH_ORIGIN = "http://return.local";
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

function firstValue(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value;
}

export function parseLoginReason(value: unknown): LoginReason | null {
  return firstValue(value) === "session_expired" ? "session_expired" : null;
}

export function getAuthPagePaths(): string[] {
  return [
    ADMIN_ROUTES.login(),
    ADMIN_ROUTES.register(),
    ADMIN_ROUTES.forgotPassword(),
    ADMIN_ROUTES.resetPassword(),
  ];
}

export function isAuthPagePath(pathname: string): boolean {
  return getAuthPagePaths().includes(pathname);
}

// Only same-origin admin pages are allowed as a post-login destination (no open redirect).
export function getSafeReturnPath(value: unknown): string | null {
  const raw = firstValue(value);
  if (typeof raw !== "string" || !raw || raw.length > MAX_RETURN_PATH_LENGTH) return null;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || CONTROL_CHARACTERS.test(raw)) return null;

  let url: URL;
  try {
    url = new URL(raw, RETURN_PATH_ORIGIN);
  } catch {
    return null;
  }
  if (url.origin !== RETURN_PATH_ORIGIN) return null;

  const base = getAdminBasePath().replace(/\/+$/u, "");
  const { pathname } = url;
  if (base && pathname !== base && !pathname.startsWith(`${base}/`)) return null;
  if (isAuthPagePath(pathname)) return null;
  if (pathname === `${base}/api` || pathname.startsWith(`${base}/api/`) || pathname.startsWith("/admin-static/")) return null;

  return `${pathname}${url.search}`;
}
