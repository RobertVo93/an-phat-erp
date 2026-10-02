import { env } from "@/constants/env";

export type CookieSecureMode = "auto" | "true" | "false";

export interface ISessionConfig {
  // null when the secret is missing, too short, or equal to the legacy JWT_SECRET (sign throws, verify fails).
  accessTokenSecret: string | null;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  refreshTokenRenewBeforeSeconds: number;
  refreshTokenReuseGraceSeconds: number;
  cookieSecure: CookieSecureMode;
}

const MIN_SECRET_LENGTH = 32;
const DEFAULTS = {
  accessTokenTtlSeconds: 900,
  refreshTokenTtlSeconds: 2592000,
  refreshTokenRenewBeforeSeconds: 604800,
  refreshTokenReuseGraceSeconds: 60,
};

const warned = new Set<string>();
function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[session-config] ${message}`);
}

function readSeconds(key: string, value: number, fallback: number, min: number, max: number): number {
  if (!Number.isFinite(value) || value < min || value > max) {
    warnOnce(key, `invalid ${key}, using default ${fallback}`);
    return fallback;
  }
  return Math.floor(value);
}

function readSecret(): string | null {
  const secret = env.AUTH_ACCESS_TOKEN_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    warnOnce("AUTH_ACCESS_TOKEN_SECRET", `AUTH_ACCESS_TOKEN_SECRET is missing or shorter than ${MIN_SECRET_LENGTH} characters; admin logins will fail`);
    return null;
  }
  if (env.JWT_SECRET && secret === env.JWT_SECRET) {
    warnOnce("AUTH_ACCESS_TOKEN_SECRET", "AUTH_ACCESS_TOKEN_SECRET must not reuse the legacy JWT_SECRET value; admin logins will fail");
    return null;
  }
  return secret;
}

export function getSessionConfig(): ISessionConfig {
  const refreshTokenTtlSeconds = readSeconds(
    "AUTH_REFRESH_TOKEN_TTL_SECONDS", env.AUTH_REFRESH_TOKEN_TTL_SECONDS, DEFAULTS.refreshTokenTtlSeconds, 60, 34560000
  );
  const accessTokenTtlSeconds = readSeconds(
    "AUTH_ACCESS_TOKEN_TTL_SECONDS", env.AUTH_ACCESS_TOKEN_TTL_SECONDS, DEFAULTS.accessTokenTtlSeconds, 10, 86400
  );
  const refreshTokenRenewBeforeSeconds = readSeconds(
    "AUTH_REFRESH_TOKEN_RENEW_BEFORE_SECONDS",
    env.AUTH_REFRESH_TOKEN_RENEW_BEFORE_SECONDS,
    Math.min(DEFAULTS.refreshTokenRenewBeforeSeconds, refreshTokenTtlSeconds),
    0,
    refreshTokenTtlSeconds
  );
  const refreshTokenReuseGraceSeconds = readSeconds(
    "AUTH_REFRESH_TOKEN_REUSE_GRACE_SECONDS", env.AUTH_REFRESH_TOKEN_REUSE_GRACE_SECONDS, DEFAULTS.refreshTokenReuseGraceSeconds, 0, 600
  );

  if (accessTokenTtlSeconds >= refreshTokenRenewBeforeSeconds) {
    warnOnce(
      "renew-window",
      "AUTH_ACCESS_TOKEN_TTL_SECONDS is not shorter than AUTH_REFRESH_TOKEN_RENEW_BEFORE_SECONDS; refresh tokens may expire without being renewed"
    );
  }

  const secureMode = String(env.AUTH_COOKIE_SECURE).trim().toLowerCase();
  let cookieSecure: CookieSecureMode = "auto";
  if (secureMode === "true" || secureMode === "false" || secureMode === "auto") {
    cookieSecure = secureMode;
  } else {
    warnOnce("AUTH_COOKIE_SECURE", "invalid AUTH_COOKIE_SECURE, using auto");
  }

  return {
    accessTokenSecret: readSecret(),
    accessTokenTtlSeconds,
    refreshTokenTtlSeconds,
    refreshTokenRenewBeforeSeconds,
    refreshTokenReuseGraceSeconds,
    cookieSecure,
  };
}
