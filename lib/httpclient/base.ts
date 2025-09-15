import { getAdminBasePath } from "@/constants";

export function apiHref(path: string): string {
  const base = getAdminBasePath();
  const normalizedPath = `/${path.replace(/^\/+/u, "")}`;
  return `${base}${normalizedPath}`.replace(/\/{2,}/gu, "/");
}

export function createApiUrl(path: string): URL {
  return new URL(apiHref(path), window.location.origin);
}


