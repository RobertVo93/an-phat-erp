# Admin refresh-token sessions: implementation plan

- **Ticket:** AP-&lt;n&gt; (to be confirmed).
- **Repo:** `admin/` (`RobertVo93/an-phat-erp`). The only work outside admin is documentation (§13).
- **Status:** plan only. Nothing is implemented or committed. This file is untracked.
- **Paths** are relative to `admin/` unless they start with `ecom/`, `pos/` or `/workspaces/anphat/`.
- **Behaviour choices:** every one is listed in §18 with a recommended default, and the plan is written with those defaults.

---

## 0. At a glance

| | Today | After |
|---|---|---|
| Access token | JWT `{userId}` valid **7 days**, in cookie `token` (`Path=/`, `SameSite=Lax`, no Max-Age, so a session cookie) | JWT `{userId, sid, typ:"access"}` plus `iss`/`aud`, valid **15 min**, in cookie `admin_access_token` (`Path=/admin`, `SameSite=Strict`, Max-Age = TTL) |
| Refresh token | none | A random 256-bit value. Only its **sha256** is stored, in the new table `refresh_tokens`. It lives in cookie `admin_refresh_token` (`Path=/admin/api/auth`, `SameSite=Strict`, Max-Age = **30 days**) |
| Access token expires | Every API call returns 401 and the page is "blocked" | One silent `POST /admin/api/auth/refresh`, shared by all parallel calls and tabs, then the failed call is retried once. The user notices nothing |
| 7 days or less left on the refresh token | n/a | That refresh also issues a **new 30-day refresh token** |
| Refresh token expired or invalid | n/a | `/refresh` returns 401. The browser goes to `/admin/login?reason=session_expired&next=<page>` with a vi/en message and returns to the page after login |
| Revocation | impossible | **Immediately:** logout, re-login, password reset. **At the next refresh (15 min at most):** deactivation, a non-staff role, or a password changed from ecom |

---

## 1. Why `/admin` gets "blocked" today

1. **The token dies silently.**
   - Login signs `{ userId }` for 7 days (`lib/auth/jwt.ts:5-7`, `app/api/auth/login/route.ts:84`).
   - It stores the token in cookie `token` with no Max-Age (`login/route.ts:97`), so the cookie can also vanish when the browser restarts.
2. **The UI trusts localStorage forever.**
   - `AuthProvider` derives `isAuthenticated = !!user` from localStorage `user` (`contexts/auth-context.tsx:28-39,67`).
   - `AuthGuard` checks only that flag (`components/auth-guard.tsx:23-33`).
   - `user` is removed only by an explicit logout.
3. **Nobody handles 401.**
   - After expiry, every protected route returns 401 (`lib/auth/jwt.ts:18-24`), but no `fetch()` in `lib/httpclient/*.client.ts` reacts to it.
   - `ERPLayout` swallows its failed permission probe (`components/erp-layout.tsx:42-52`). Non-admins get the access-denied card, which has no header and no logout (`:95-110`). Admins get empty lists and failing saves.
   - Nothing ever redirects to login.

---

## 2. Verified security problems in the same code (read before deciding scope)

All items were verified in the code. No secret values were printed; the secret comparison was done by hash.

| # | Problem | Evidence | Handled in |
|---|---|---|---|
| S1 | **Anyone can take over any account, including super admins, without logging in.** `PUT /api/users/[id]` has no auth and accepts `email`, `username`, `role` and `active`. An attacker sets the victim's email to their own, then calls the public forgot-password, which mails the reset link to `user.email`. The same PUT can also make any account a `super_admin` | `app/api/users/[id]/route.ts:91-124`, `app/api/users/user.schema.ts:4-10`, `lib/services/passwordResetService.ts:54,81` | **Phase 0 hotfix (§12)** |
| S2 | `GET /api/users` and `GET /api/users/[id]` return `password` and `passwordSalt` (bcrypt hash and salt) to any logged-in user, and anyone can get a login through the public register | `lib/services/user.service.ts:95-124` (full entities), `app/api/users/[id]/route.ts:136-145`, `app/api/auth/register/route.ts` | **Phase 0 hotfix (§12)** |
| S3 | **The JWT signing secret is public.** The value in `admin/.env` equals the committed `docker-compose.yml:43` value and the hard-coded fallbacks in `constants/env.ts:9` and `pos/constants/env.ts:9`. Those fallbacks reach **browser JS** in admin and pos through the `@/constants` barrel (`lib/httpclient/base.ts:1` → `constants/index.ts` → `env`). Anyone can mint admin access tokens wherever that value is in use | hash comparison of the 4 sources | Phase 1: a new, required signing secret with no fallback (§6). **Ops now:** check that production does not use this value |
| S4 | **Login checks neither `active` nor role.** Customers (ecom users, and admin-created customers whose password is their creation date `YYYYMMDD`) can log into admin, and admin APIs have no role checks. A 30-day session would make this durable | `lib/services/user.service.ts:12-17`, `lib/services/customerService.ts:64` | Staff-role allowlist at login and refresh (D6). Can ship in Phase 0 |
| S5 | The login page advertises demo credentials, says "any email/password" works, and has an auto-fill button | `components/auth/login-form.tsx:53-58,91-103` | Remove the block (D12) and check whether that account exists (§15) |
| S6 | ecom's public register upserts `users` by a client-supplied `userId`, so it can overwrite any user's password and role | `ecom/app/api/auth/register/route.ts:9-10` | Separate ecom ticket. Admin detects it through the password fingerprint and the role allowlist |

**Recommendation:** ship S1 and S2 (plus S4 and S5 if approved) as a small hotfix **before** the refresh-token work. They need no new table (§12).

---

## 3. Requirement → mechanism

| Requirement | Mechanism |
|---|---|
| Refresh token lasts 1 month | The refresh row has `expires_at = issue + 30 days`, and the cookie's Max-Age is derived from it |
| Access token expires → regenerate automatically | Access JWT valid 15 min. The client refreshes silently: pre-emptively when its metadata says the token is stale, and reactively after any 401 (refresh once, retry the call once) |
| Near expiry (1 week before) → regenerate the refresh token | `/api/auth/refresh` issues a **new** 30-day token in the same family when `expires_at − now ≤ 7 days`. Otherwise it only issues an access token and leaves the refresh cookie alone |
| Refresh token expired → redirect to login | `/refresh` returns 401. The client clears its state and does a full navigation to `/admin/login?reason=session_expired&next=…`. An expiry timer and resume checks make this happen even on an idle tab |

**Timeline:**
- **Day 0:** login; the refresh token expires on day 30.
- **Days 5 and 20:** activity only renews the 15-minute access token.
- **Day 23 or later:** the first refresh rotates, so the new token expires on day 53 or later.
- **No visit between days 23 and 30:** the session ends on day 30.

**Why the access token must be short:** with a 7-day access token, an active user might never call `/refresh` in the final week, so the renewal rule could never fire.

---

## 4. Token model

### 4.1 Access token (stateless, no DB per request)

- **Claims:** JWT HS256 `{ userId, sid, typ: "access", iss: "anphat-admin", aud: "anphat-admin-api", iat, exp }`.
  - `userId` stays, because two routes read it: `app/api/orders/[id]/route.ts:35` and `app/api/warehouse/transfer/route.ts:31`.
  - `sid` is the refresh family id, used for logs only.
- **Secret:** signed with `env.AUTH_ACCESS_TOKEN_SECRET`.
  - It is required and must be at least 32 characters. It has **no fallback**, and while the legacy key exists it must differ from `env.JWT_SECRET` (S3, D14).
  - When it is invalid, signing throws, so login returns 500, and verification returns null (fail closed). Either way the log explains the cause once.
- **Lifetime:** `expiresIn` is a **number** of seconds, from config. `@types/jsonwebtoken` 9.0.9 types it as `StringValue | number`, so a plain `string` from env would fail tsc.
- **Verification:** `jwt.verify(token, secret, { algorithms: ["HS256"], issuer, audience })`, then require `typ === "access"` and a string `userId`. Old 7-day tokens fail this and are rejected.
- **The 72 `getUserFromRequest` call sites in 36 route files stay untouched.** The function stays synchronous. Revocation reaches the API within one access TTL.

### 4.2 Refresh token (stateful, revocable)

- **Value:** `crypto.randomBytes(32).toString("base64url")`, 43 characters, the same generator as `passwordResetService.ts:99-100`.
  - Only `sha256(token)` in hex is stored.
  - The raw value exists only in `Set-Cookie` and the browser's cookie jar, never in JSON bodies, localStorage or logs.
- **Family:** every login creates a family (`crypto.randomUUID()`), and rotations stay in it. Logout and reuse detection revoke the whole family.
- **Password fingerprint:** `sha256(users.password)` is stored when a token is issued and compared on every refresh.
  - Any write that changes `users.password` changes the fingerprint and ends the admin session within one access TTL. That includes ecom's change-password, which bypasses admin, ecom's register upsert, and ecom's guest upsert (which blanks the password to `""`).
- **Rotation (the requirement):** when `expires_at − now ≤ RENEW_BEFORE` (7 days):
  - insert a new row in the same family, valid 30 days, with the current fingerprint;
  - mark the old row `revoked_at = now`, `revoked_reason = rotated`, `replaced_by_id = <new id>`;
  - send the new cookie.

  Otherwise only `last_used_at` is updated and **the refresh cookie is not re-sent**, so its Max-Age always matches `expires_at`.
- **Recovery and reuse detection.** A rotated token can come back for three reasons: two tabs raced, the rotation response was lost, or the token was stolen. When a rotated token is presented:
  1. Walk `replaced_by_id` to the newest row in the chain (the *head*).
  2. If the head is valid, and either it has **never been used** (`last_used_at IS NULL`) or the presented token was rotated **less than 60 s ago** (the grace), this is a race or a lost response. **Rotate again from the head** and send that new cookie. The browser always ends up with a working token, whichever response arrives last.
  3. Otherwise the legitimate client already moved on and someone replayed an old token: this is **reuse**. Revoke the whole family, return 401 `reuse_detected`, and `console.warn`.
  4. Because of step 2, lost responses and tab races never cause a false logout. A reuse warning is still a signal, not proof of theft.
- **Checks on every refresh:**
  - the row exists and is not expired;
  - it is not revoked (or it is recoverable, as above);
  - the user exists;
  - `active !== false`;
  - the role is on the admin allowlist (`super_admin`, `admin`, `manager`, `staff`; D6);
  - the fingerprint matches.

  A failed check revokes the family and returns a 401 with a machine-readable `code`.

### 4.3 Who knows the remaining lifetime

- **Server:** `refresh_tokens.expires_at` is the source of truth.
- **Browser cookie jar:** the Max-Age is derived from it.
- **Client JS:** login and refresh return `session.accessTokenExpiresIn` and `session.refreshTokenExpiresIn` in **seconds**.
  - They are relative, so client clock skew does not matter.
  - The client stores them as local timestamps in localStorage `admin_session`, and uses them only to decide **when to ask**. The server always decides the outcome.

---

## 5. Cookies

| | `admin_access_token` | `admin_refresh_token` | legacy `token` |
|---|---|---|---|
| Value | access JWT | opaque 43-character token | old 7-day JWT |
| HttpOnly / SameSite | yes / **Strict** | yes / **Strict** | n/a |
| Secure | from `AUTH_COOKIE_SECURE` | same | n/a |
| Path (zone) | `/admin` | `/admin/api/auth` | cleared at `/` |
| Path (standalone, empty base path) | `/` | `/api/auth` | cleared at `/` |
| Max-Age | access TTL | seconds until the row's `expires_at` | 0 |
| Set by | login, refresh 200 | login; refresh **only when it rotates** | never |
| Cleared by | logout, refresh 401 (see the exception in §8.5) | same | login, logout, refresh 401 |

**The Path must include the zone prefix.**
- ecom rewrites `/admin/:path+` to admin with the prefix stripped (`ecom/next.config.js:14-16`). Admin sees `/api/auth/refresh`, but the browser matches the cookie Path against the URL it sees, `/admin/api/auth/refresh`. A cookie with `Path=/api/auth` would be stored but never sent.
- Paths are built from `getAdminBasePath()` (`constants/nav.ts:27-36`) with trailing slashes trimmed.
- Next's external-rewrite proxy passes `Set-Cookie` through unchanged; today's login already relies on this.
- `Path=/admin` does not match `/admin-static/*`, because path matching needs a `/` boundary.

**What the scoping achieves:**
- Admin tokens stop travelling to ecom (`/`) and pos (`/pos`). Today's `Path=/` `token` goes to every request on the origin.
- The refresh token is sent only to `/admin/api/auth/*`: login, refresh and logout need it.
- It also reaches forgot-password, reset-password and register, which ignore cookies, so the ecom contract is unaffected.

**Why new names instead of `token`:**
- Next's `ResponseCookies` is a map keyed by name, so one response cannot set a new `token` at `/admin` and clear the legacy `token` at `/`.
- A leftover `Path=/` `token` would also shadow a narrower cookie with the same name.

**Why SameSite=Strict:**
- Every consumer is a same-origin `fetch`. Strict cookies are sent on those even after arriving from an external link.
- No page reads cookies, there is no middleware, and nothing navigates top-level to `/api` (checked with grep).
- Strict also blocks cross-site top-level GETs to the mutating `GET /api/payroll/sync`.

**Secure flag, `AUTH_COOKIE_SECURE=auto|true|false` (default `auto`):**
- `auto` sets Secure when the first `X-Forwarded-Proto` value is `https`, else when `req.nextUrl.protocol` is `https:`. This is the header logic of `getPublicOrigin` (`lib/utils.request.ts:3-12`).
- Dev over `http://localhost:3030` gets no Secure flag.
- `NODE_ENV` cannot be used, because compose, `admin/.env` and the Dockerfile (`CMD pnpm dev`) all run development.
- Set `true` in production if it is HTTPS (D9).

**Other rules:**
- Cookies are host-only (no `Domain`), with no `__Host-` or `__Secure-` prefix: `__Host-` forces `Path=/` and `__Secure-` breaks http dev.
- Always set and clear through one helper. Clearing uses the same name, Path and attributes with `maxAge: 0`.

**Consequence (D8):** pos can no longer reuse admin's session cookie as `pos/CLAUDE.md` §4.4 step 6 suggests. A future pos backend needs its own auth design.

---

## 6. Configuration

Add these keys to `constants/env.ts` after `RESET_EMAIL_RESEND_COOLDOWN_MINUTES`, in its `Number(process.env.X || n)` style. **None of them is `NEXT_PUBLIC_`, and the secret's default is `''` (no literal).**

| Key | Default | Notes |
|---|---|---|
| `AUTH_ACCESS_TOKEN_SECRET` | `''` | **Required.** At least 32 characters and different from `JWT_SECRET`. Generate it locally (`openssl rand -base64 48`) and put it only in `admin/.env` (gitignored) and the production secret store. Never in compose, chat or a PR. Rotating it later logs nobody out: clients just refresh |
| `AUTH_ACCESS_TOKEN_TTL_SECONDS` | `900` | clamped to 10..86400 |
| `AUTH_REFRESH_TOKEN_TTL_SECONDS` | `2592000` (30 days) | clamped to 60..34560000 (browsers cap cookies at 400 days) |
| `AUTH_REFRESH_TOKEN_RENEW_BEFORE_SECONDS` | `604800` (7 days) | clamped to 0..refresh TTL |
| `AUTH_REFRESH_TOKEN_REUSE_GRACE_SECONDS` | `60` | clamped to 0..600 |
| `AUTH_COOKIE_SECURE` | `auto` | `auto`, `true` or `false` |

**`lib/auth/session-config.ts` (new):**
- `getSessionConfig()` parses and clamps these values, and warns once (`[session-config] invalid <KEY>, using default`) when a value is bad or when `ACCESS_TTL >= RENEW_BEFORE`.
- It imports only `@/constants/env`, so it is safe under the ts-node migration CLI.

**Other configuration notes:**
- **`.env.example`:** add the 6 keys with placeholders, the comment `ACCESS_TTL < RENEW_BEFORE < REFRESH_TTL`, and a note that `JWT_SECRET` is now legacy and unused by admin.
- **Legacy `JWT_SECRET`:** leave the line and its fallback in `constants/env.ts` untouched, as `admin/CLAUDE.md:44` requires. Deleting it needs your approval (D14).
- **Compose:** add nothing. The admin service loads `admin/.env` through `env_file`, and its `environment:` list does not override these keys. Apply changes with `docker compose up -d --force-recreate admin`.

---

## 7. Database (admin-only table, recipe R1)

### 7.1 Types

**`types/enums.ts`:** values equal their keys.
```ts
export enum RefreshTokenRevokeReason {
  logout = "logout", rotated = "rotated", reuse_detected = "reuse_detected",
  password_changed = "password_changed", password_reset = "password_reset",
  user_inactive = "user_inactive", role_not_allowed = "role_not_allowed", superseded = "superseded",
}
```

**`types/auth.ts` (new), exported from `types/index.ts`:**
- `IRefreshToken extends IBase`. Import `IBase` by path from `./base.interface`, which is not in the barrel.
- `ISessionUser = Pick<IUser, "id" | "email" | "username" | "role" | "active" | "lastLogin">`: the same fields login returns today.
- `IAuthSession { accessTokenExpiresIn: number; refreshTokenExpiresIn: number; rotated?: boolean }` (seconds).
- `IAuthSessionResponse { success: true; user: ISessionUser; session: IAuthSession }`.

### 7.2 Entity `lib/database/entities/refresh-token.entity.ts`

```ts
@Entity({ name: "refresh_tokens" })
@Unique("UQ_refresh_tokens_token_hash", ["tokenHash"])
@Index("IDX_refresh_tokens_user_id", ["userId"])
@Index("IDX_refresh_tokens_family_id", ["familyId"])
@Index("IDX_refresh_tokens_expires_at", ["expiresAt"])
export class RefreshTokenEntity extends BaseEntity implements IRefreshToken {
  @Column({ name: "user_id", type: "uuid", nullable: false }) userId!: string;
  @Column({ name: "family_id", type: "uuid", nullable: false }) familyId!: string;
  @Column({ name: "token_hash", type: "varchar", length: 64, nullable: false }) tokenHash!: string;
  @Column({ name: "password_fingerprint", type: "varchar", length: 64, nullable: false }) passwordFingerprint!: string;
  @Column({ name: "expires_at", type: "timestamp", nullable: false }) expiresAt!: Date;
  @Column({ name: "last_used_at", type: "timestamp", nullable: true }) lastUsedAt?: Date | null;
  @Column({ name: "revoked_at", type: "timestamp", nullable: true }) revokedAt?: Date | null;
  @Column({ name: "revoked_reason", type: "enum", enum: RefreshTokenRevokeReason,
    enumName: "refresh_tokens_revoked_reason_enum", nullable: true }) revokedReason?: RefreshTokenRevokeReason | null;
  @Column({ name: "replaced_by_id", type: "uuid", nullable: true }) replacedById?: string | null; // plain id, no FK
  @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", foreignKeyConstraintName: "FK_refresh_tokens_user_id" })
  user?: IUser;
}
```

- **Exemplars:** `password-reset-token.entity.ts` (snake_case columns, plus a column and a relation on the same `user_id`) and `setting.entity.ts` (named `@Unique`/`@Index`).
- **Imports:** `./base.entity` and `./user.entity` relatively, never the barrel; the enum from `@/types/enums`; types with `import type`.
- No hooks, and no inverse relation on `UserEntity`. `created_by` holds the user id.
- **`ON DELETE CASCADE` is required**, because deleting a customer hard-deletes its `users` row (`lib/services/customerService.ts:112`).
- **`foreignKeyConstraintName`:** confirm that it exists in TypeORM 0.3.24 after `pnpm install`. If it doesn't, drop it and accept the generated name.

### 7.3 Registration

Register the entity in both places:
- `lib/database/entities/index.ts`: `export * from "./refresh-token.entity"`.
- The explicit `entities: [...]` in `lib/database/typeorm.ts`, after `PasswordResetTokenEntity`.

### 7.4 Migration (against the LOCAL database only)

> ⚠️ `admin/.env`'s **active** `DATABASE_URL` points at the remote **Neon "Dev"** database. The local URL is the commented-out line. Run migration commands **inside the admin container**, where compose overrides `DATABASE_URL` to the local `db` service. Never run `migration:gen` or `migration:revert` from the host with the default `.env`.

1. `docker compose exec admin pnpm migration:run`: the local DB must be at head.
2. `docker compose exec admin pnpm migration:gen AddRefreshTokensTable` produces `lib/database/migrations/<YYYYMMDD>-AddRefreshTokensTable.ts`.
   - The class timestamp must be greater than `1782038400000` (`AddProductTierPrices`); a generated `Date.now()` is.
   - If you write it by hand, use e.g. `1790726400000`.
3. Review the SQL. Keep only:
   - `CREATE TYPE "public"."refresh_tokens_revoked_reason_enum"`;
   - `CREATE TABLE "refresh_tokens"`, with the `UQ_…` constraint;
   - the 3 `CREATE INDEX` statements;
   - the FK `ON DELETE CASCADE`.

   **Strip the known drift:** `payroll_records."employeeId"` and `warehouse_products.*_id` nullability, and the `password_reset_tokens` indexes/FK. `down()` must mirror `up()`: drop the FK, the indexes, the table, then the type.
4. `migration:run`, then `migration:revert`, then `migration:run`. Commit the entity and migration together.
5. **No ecom mirror:** the table is admin-only and `users` does not change.

### 7.5 Cleanup

- `cleanupExpiredRefreshTokensService()` runs after a successful login, at most once per hour per server process.
- It deletes rows with `expires_at < now − 7 days`, using the index. `repo.delete` has a precedent in `passwordResetService.ts`.
- Errors are only logged and never fail the login. Revoked rows are kept for incident review until 7 days after their natural expiry.

---

## 8. Server changes

### 8.1 `lib/auth/jwt.ts` (rewrite)

```ts
export const ACCESS_TOKEN_COOKIE = "admin_access_token";
export interface IAccessTokenPayload { userId: string; sid: string; typ: "access"; iat: number; exp: number } // standalone on purpose
export function signAccessToken(userId: string, sessionId: string): { token: string; expiresInSeconds: number };
export function verifyAccessToken(token: string): IAccessTokenPayload | null;
export function getUserFromRequest(req: NextRequest): IAccessTokenPayload | null; // cookie first, then Bearer; sync; no DB
```

- **Delete `signJwt` and `verifyJwt`.** Their only callers are login and register.
- **Keep `getUserFromRequest` synchronous.** An async version would turn any forgotten `await` among 72 call sites into a silent bypass, and admin has no ESLint.
- **A standalone payload type**, not `extends jwt.JwtPayload`. `JwtPayload`'s index signature would hide misuse; this one makes tsc flag the broken `user.id || user.username` lines (§8.7).
- **Do not import `@/constants/nav` here.** This file is imported by 36 route files.

### 8.2 `lib/auth/session-cookies.ts` (new, route handlers only)

```ts
export const REFRESH_TOKEN_COOKIE = "admin_refresh_token";
export const LEGACY_ACCESS_TOKEN_COOKIE = "token"; // TODO(AP-<n>): stop clearing ≥30 days after release
export function getAccessCookiePath(): string;   // trimmed getAdminBasePath() || "/"
export function getRefreshCookiePath(): string;  // `${trimmed base}/api/auth`
export function setAccessTokenCookie(res: NextResponse, req: NextRequest, token: string, maxAgeSeconds: number): void;
export function setRefreshTokenCookie(res: NextResponse, req: NextRequest, token: string, expiresAt: Date): void;
export function clearSessionCookies(res: NextResponse, req: NextRequest): void; // access + refresh + legacy, maxAge 0
export function getRefreshTokenFromRequest(req: NextRequest): string | null;   // must match /^[A-Za-z0-9_-]{43}$/
export function toSessionUser(user: IUser): ISessionUser;                       // never password fields
export function buildSessionResponse(user: IUser, accessExpiresIn: number, refreshExpiresAt: Date, rotated?: boolean): NextResponse<IAuthSessionResponse>;
```

- Every cookie gets `{ httpOnly: true, sameSite: "strict", secure: isSecureRequest(req), path }`.
- Every auth response sets `Cache-Control: no-store`.
- Set and clear only through `res.cookies`. `ResponseCookies` rewrites all `Set-Cookie` headers from its map, so a header added by hand would be wiped.

### 8.3 Cross-site guard: `lib/utils.request.ts#getAuthRequestGuardError(req)`

This guard is used **only** by login, refresh and logout. forgot-password, reset-password and `settings/type/[type]` stay untouched, because ecom calls them.

It returns `null` when the request is allowed. Otherwise it returns 403 `{ error: "Forbidden", code: "cross_site" }` and logs the compared header names and values, never cookies. The rules:
1. If `Sec-Fetch-Site` is present, it must be `same-origin`.
2. The request must carry the custom header **`X-Admin-Auth: 1`**. The admin client sets it on these three calls.
   - Cross-site HTML forms cannot send custom headers.
   - A cross-origin `fetch` with the header needs a CORS preflight, which admin never grants.

What this blocks:
- login CSRF (today `req.json()` also parses a `text/plain` form body);
- forced logout;
- a cross-site POST to `/refresh` whose 401 would clear the victim's cookies.

It does not depend on `Host` or `Origin` rewriting by proxies, so it also works over plain-HTTP deployments, where browsers send no `Sec-Fetch-*` headers.

### 8.4 `lib/services/refreshTokenService.ts` (new, function style)

**Rules for this file:**
- No `ensureDataSource()` here (routes call it).
- No `next/*`, `jwt.ts` or `session-cookies.ts` imports, so it stays ts-node safe.
- Entities are imported by path; config comes from `session-config.ts`.
- **Every read and write inside a transaction uses that transaction's `manager`.** A repository from `AppDataSource` inside the transaction would wait on the transaction's own lock and hang.

```ts
export type RefreshFailureCode = "not_found" | "expired" | "revoked" | "reuse_detected" | "user_inactive" | "role_not_allowed" | "password_changed";
export interface IIssuedRefreshToken { id: string; token: string; familyId: string; expiresAt: Date }
export type RefreshSessionResult =
  | { ok: true; user: IUser; familyId: string; refreshExpiresAt: Date; rotatedToken?: IIssuedRefreshToken }
  | { ok: false; code: RefreshFailureCode; revokedReason?: RefreshTokenRevokeReason; userId?: string; familyId?: string };
export function hashRefreshToken(token: string): string;                      // sha256 hex
export function getPasswordFingerprint(passwordHash?: string | null): string; // sha256 hex of users.password ("" if null)
export async function createRefreshTokenService(input: { userId: string; passwordHash?: string | null; familyId?: string }, manager?: EntityManager): Promise<IIssuedRefreshToken>;
export async function refreshSessionService(token: string): Promise<RefreshSessionResult>;
export async function revokeRefreshTokenFamilyService(token: string, reason: RefreshTokenRevokeReason): Promise<boolean>;
export async function revokeUserRefreshTokensService(userId: string, reason: RefreshTokenRevokeReason, manager: EntityManager): Promise<number>;
export async function cleanupExpiredRefreshTokensService(): Promise<number>;
```

**Account policy, `lib/auth/session-policy.ts` (new, ts-node safe, no `next/*` imports):**
- `ADMIN_SESSION_ROLES = [super_admin, admin, manager, staff]`. This is an **allowlist**, so any role added to the shared enum later is denied by default.
- `getAdminSessionDenial(user: Pick<IUser, "active" | "role">): "user_inactive" | "role_not_allowed" | null`.
- The return values are identical to the `RefreshTokenRevokeReason` keys, so Phase 1 maps them directly.
- Login uses the file in Phase 0 (if D6 is approved), and refresh uses it in Phase 1.

**Locking model: one lock per family.**
- Every operation that changes a family runs in a transaction that first calls:
  ```sql
  SET LOCAL lock_timeout = '5s';
  SELECT pg_advisory_xact_lock(hashtextextended(<familyId>, 0));
  ```
  This covers refresh, rotation, recovery, logout, `superseded` and reuse revocation.
- Operations on one family are therefore strictly serialized, whichever token of the family was presented.
- A revocation always sees successors committed by an earlier rotation, and a stale `save` can never un-revoke a row.
- The lock is released at commit and is re-entrant within the transaction. `hashtextextended` needs PostgreSQL 11 or later; compose uses `postgres:latest`, and Neon is newer.
- A lock wait longer than 5 s becomes a 500, which the client treats as transient, never as a hang.

**`refreshSessionService(token)` inside one `AppDataSource.transaction`, all times in JS:**
1. Set `lock_timeout`. `found = findOne({ where: { tokenHash } })`. If there is none, return `not_found`.
2. Take the family lock on `found.familyId`, then **re-read** `presented` by id: the fresh state after the lock.
3. If `presented.expiresAt <= now`, return `expired`.
4. If `presented.revokedAt` is set:
   - the reason is not `rotated`: return `revoked` with `revokedReason`;
   - otherwise walk `replacedById` (at most 20 hops) to the head. If the head is missing, revoked or expired, return `revoked`;
   - `inGrace = now − presented.revokedAt <= grace`. If `head.lastUsedAt` is set and not `inGrace`: revoke the family (`reuse_detected`) and return `reuse_detected` with `userId` and `familyId`;
   - otherwise `current = head` and `mustRotate = true` (**recovery**).
5. Otherwise `current = presented`.
6. Load the user with `manager.getRepository(UserEntity).findOne({ where: { id: current.userId } })`. If there is none, return `not_found`.
7. `denial = getAdminSessionDenial(user)`, or `password_changed` if the fingerprint differs. If there is a denial, revoke the family and **return** it.
   - Return, don't throw, so the revocation commits.
8. `current.lastUsedAt = now`.
   - If `mustRotate` or `current.expiresAt − now <= renewBefore`: call `createRefreshTokenService({ userId, passwordHash: user.password, familyId }, manager)`, set `current.revokedAt = now`, `revokedReason = rotated` and `replacedById = next.id`, `save`, and return `ok` with `rotatedToken`.
   - Otherwise `save` and return `ok` with `refreshExpiresAt = current.expiresAt`.

**Revocation helpers:**
- **`revokeFamilyLocked(manager, familyId, reason)`** (private): family lock, then `find({ where: { familyId, revokedAt: IsNull() } })`, set `revokedAt` and `revokedReason`, then `save(rows)`.
  - Rows already `rotated` keep their reason and `replaced_by_id`, so the audit chain survives.
  - Never `repo.update`, per `admin/CLAUDE.md`.
- **`revokeRefreshTokenFamilyService(token, reason)`**, used by logout and by login's `superseded`: its own transaction plus `lock_timeout`. Find the row by hash, then `revokeFamilyLocked`. Returns `false` if there is no row.
- **`revokeUserRefreshTokensService(userId, reason, manager)`**, used by password reset inside its transaction: find the distinct `familyId`s of the user's unrevoked rows, sort them, and call `revokeFamilyLocked` for each.
  - Sorted order prevents deadlocks.
  - A successor created concurrently still carries the old fingerprint, so its next refresh fails with `password_changed`.
  - No deadlock with the reset's `UPDATE users` is possible: the reset takes `FOR NO KEY UPDATE`, which does not conflict with the `FOR KEY SHARE` of the refresh-row FK insert.

### 8.5 Routes and contracts

Common rules:
- Every auth response sets `Cache-Control: no-store`.
- Logs are tagged `[api/auth/<x>]` and never contain tokens, hashes or cookie headers.
- New request schemas go in `app/api/auth/auth.schema.ts`: `LoginSchema` with a trimmed username of 1..255 characters and a password of 1..1024.

| Route | Guard | Request | 200 body | Errors | Cookies |
|---|---|---|---|---|---|
| `POST /api/auth/login` | §8.3 | `{username, password}` (`LoginSchema`) | `{ success: true, user: ISessionUser, session: IAuthSession }`. `user` has the same fields as today; `session` is new | 400 `{error:"Invalid input", details}`; **401 `{error:"Email or password is incorrect"}` (unchanged)**; 403 `{error:"Account is not allowed to sign in", code:"account_not_allowed"}` (after the password check, so it does not enumerate users); 403 `cross_site`; 500 `{error:"Failed to login"}` | set access + refresh; clear legacy |
| `POST /api/auth/refresh` (**new**) | §8.3; the refresh cookie is the credential | no body | the same as login, plus `session.rotated` | 401 `{error:"Unauthorized", code}`: `missing`, `not_found`, `expired`, `revoked`, `reuse_detected`, `user_inactive`, `role_not_allowed`, `password_changed`; 403 `cross_site`; 500 `{error:"Failed to refresh session"}` with **cookies untouched** (transient) | set access; set refresh **only when rotated**. On 401: clear all, **except** for `revoked` with reason `logout` or `superseded` |
| `POST /api/auth/logout` | §8.3 | none; refresh cookie optional | `{ success: true }` (unchanged) | 403 `cross_site`; 500 `{error:"Failed to log out"}` if revocation failed (**cookies still cleared**) | clear access + refresh + legacy |
| `POST /api/auth/register` | unchanged (public) | unchanged | `{ success: true }` (unchanged) | unchanged | **no cookie any more** |
| `forgot-password`, `reset-password`, `settings/type/[type]` | unchanged | unchanged | unchanged | unchanged | none (ecom contract) |

**The refresh 401 exception:**
- With reason `logout`, that logout already cleared the cookies.
- With reason `superseded`, a newer login has already put fresh cookies in the jar.
- Clearing in either case could wipe a newer session.

**Login:**
1. Guard.
2. `LoginSchema.safeParse(await req.json().catch(() => null))`.
3. `ensureDataSource()`.
4. `verifyUser`, or 401.
5. `getAdminSessionDenial`, or 403.
6. If an old refresh cookie is present: `revokeRefreshTokenFamilyService(old, superseded)`. Best effort: log failures only.
7. `createRefreshTokenService({ userId, passwordHash: user.password })`.
8. `signAccessToken(user.id, familyId)`.
9. `buildSessionResponse`: `lastLogin` is the previous value, as today.
10. `updateLastLogin`.
11. Set both cookies and clear the legacy one.
12. Throttled cleanup, catching and logging errors.
13. In `catch`: `console.error("[api/auth/login] Failed to login", { error })` and return 500.

**Refresh:**
1. Guard.
2. Read the cookie. If it is missing, return 401 `missing` and clear. If `admin_access_token` is present at the same time, also `console.warn` that the Secure flag or Path is misconfigured.
3. `ensureDataSource()`, then `refreshSessionService`.
4. If the result is `!ok`, return 401 with `code`, clearing cookies per the exception above. On `reuse_detected`, `console.warn("[api/auth/refresh] Refresh token reuse detected; family revoked", { userId, familyId })`.
5. Otherwise sign the access token, set its cookie, set the refresh cookie if `rotatedToken` exists, and return the body.
6. On an exception, return 500 and leave the cookies untouched.
7. Other methods get Next's automatic 405.
8. The commit body must justify this route without an access token: "authenticated by the httpOnly refresh cookie; must work after the access token expired".

**Logout:**
1. Guard.
2. If a refresh cookie is present: `ensureDataSource()` and `revokeRefreshTokenFamilyService(token, logout)` in try/catch.
3. Always `clearSessionCookies`.

**Register:** remove the `signJwt` import and the cookie block (`register/route.ts:97-107`). The register form already redirects to login.

### 8.6 `lib/services/passwordResetService.ts`

In `resetPassword`, inside the existing transaction, after the `updateResult.affected` check and before the reset-token row is deleted, add:
```ts
await revokeUserRefreshTokensService(resetToken.userId, RefreshTokenRevokeReason.password_reset, manager);
```
- If revocation fails, the reset rolls back and the route returns its existing 500.
- The ecom contract is unchanged.
- ⚠️ Deploying this before the migration breaks **ecom's** reset-password as well (§15).

### 8.7 Typed payload fix

Change `createdBy: user.id || user.username` (`app/api/utility-usage/route.ts:59`) and the matching `updatedBy` (`app/api/utility-usage/[id]/route.ts:46`) to `user.userId`. Today these are always `undefined`, and tsc will force the fix once the payload is typed.

### 8.8 Intentionally unchanged

- The 72 authenticated handlers.
- Server pages (they still do no auth).
- No `middleware.ts`: Node middleware is canary-only in Next 15.2.8, and the edge runtime cannot run jsonwebtoken or TypeORM.
- The `users` schema, ecom, pos, and the three endpoints ecom calls.

---

## 9. Revocation matrix

| Trigger | Where | Mechanism | Takes effect |
|---|---|---|---|
| Logout | `/api/auth/logout` | revoke the family (`logout`) and clear cookies | immediately |
| Re-login in the same browser | login | revoke the old family (`superseded`) | immediately |
| Password reset (from admin or ecom) | `resetPassword` transaction | revoke all of the user's families (`password_reset`) | immediately (outstanding access tokens live at most 15 min) |
| Password changed or overwritten by ecom | no admin code runs | fingerprint mismatch at refresh (`password_changed`) | within 15 min |
| `active = false`, or a role outside the allowlist | Phase 0 PUT (super admin) or SQL | refresh check (`user_inactive` / `role_not_allowed`); login returns 403 | within 15 min |
| Other role changes (e.g. staff → admin) | same | no revocation; the refresh returns the new role and localStorage `user` is updated | within 15 min |
| User hard-deleted | customers DELETE | FK cascade | immediately |
| An old rotated token replayed after the legitimate client moved on | refresh | revoke the family (`reuse_detected`) | on the replay |
| `AUTH_ACCESS_TOKEN_SECRET` rotated | ops | every access token becomes invalid; clients refresh silently | immediately, nobody is logged out |

---

## 10. Client changes

**A rule for every new client module:**
- `lib/httpclient/base.ts` is also imported **on the server** (`app/api/upload-url/route.ts` → `lib/s3.ts` → `base.ts`, on Node 18).
- So `base.ts`, `client-session.ts` and `return-path.ts` must not touch `window`, `navigator` or `localStorage` at module scope.
- Feature-detect inside functions, e.g. `typeof navigator !== "undefined" && "locks" in navigator`.

### 10.1 `lib/auth/return-path.ts` (new, server and client)

- `type LoginReason = "session_expired"` and `parseLoginReason(v): LoginReason | null`.
- `getAuthPagePaths()` (login, register, forgot-password and reset-password from `ADMIN_ROUTES`) and `isAuthPagePath(pathname)`.
- `getSafeReturnPath(v: unknown): string | null` returns `pathname + search` only when all of these hold:
  - it is a string of at most 2048 characters;
  - it starts with `/` but not `//`;
  - it has no `\` and no control characters;
  - `new URL(v, "http://return.local")` keeps that origin;
  - the pathname equals `getAdminBasePath()` or starts with it plus `/` (any path passes in standalone mode);
  - it is not an auth page, `<base>/api/*` or `/admin-static/*`.

### 10.2 `lib/auth/client-session.ts` (new, browser functions, no React)

```ts
export const ADMIN_USER_STORAGE_KEY = "user";                   // legacy key, kept (admin-only; ecom/pos never use it)
export const ADMIN_SESSION_STORAGE_KEY = "admin_session";       // {userId, accessExpiresAt, accessTtlMs, refreshExpiresAt, refreshedAt}: local epoch ms, no secrets
export const ADMIN_SESSION_END_STORAGE_KEY = "admin_session_end"; // {reason: "session_expired" | "logout", at}: tells other tabs why the session ended
export function saveClientSession(user: ISessionUser, session: IAuthSession): IClientSessionMeta; // writes "user" + "admin_session"
export function readClientSession(): IClientSessionMeta | null;
export function clearClientSession(reason: "session_expired" | "logout"): void; // writes the end marker, then removes "user" + "admin_session"
export function isAccessTokenStale(meta: IClientSessionMeta | null, now?: number): boolean; // null → true; skew = clamp(10% of TTL, 5 s, 60 s)
export function buildLoginHref(opts?: { reason?: LoginReason; next?: string }): string;    // ADMIN_ROUTES.login(query) with a validated next
export function redirectToLogin(reason?: LoginReason): void; // clearClientSession; unless on an auth page: window.location.replace(buildLoginHref({ reason, next: current path }))
```

### 10.3 `lib/httpclient/base.ts`: `apiFetch` plus a single-flight `refreshSession`

`apiHref` and `createApiUrl` are unchanged. New exports:

```ts
export class ApiError extends Error { constructor(message: string, readonly status: number, readonly code?: string) { super(message); this.name = "ApiError"; } }
export type RefreshOutcome = "refreshed" | "expired" | "failed";
export function refreshSession(trigger: "unauthorized" | "stale" | "resume" | "bootstrap" | "timer", requestStartedAt?: number): Promise<RefreshOutcome>; // NEVER rejects
export function onSessionRefreshed(listener: (data: IAuthSessionResponse) => void): () => void;
export function markSessionStarted(): void;   // after login: generation++, clear the ended flag, backoff and breaker
export function markSessionEnded(): void;     // logout or expiry: later apiFetch calls get a synthetic 401 without network
export function waitForPendingRefresh(): Promise<void>;
export function withAuthLock<T>(fn: () => Promise<T>): Promise<T>; // navigator.locks "admin_auth_refresh" when available; used by login and logout
export async function apiFetch(input: string | URL, init?: RequestInit): Promise<Response>;
```

**`apiFetch(input, init)`:**
1. Resolve the URL against `location.origin`. If it is cross-origin, outside `apiHref("/api/")`, or under `apiHref("/api/auth/")`, return plain `fetch(input, init)`. This is defensive: auth flows never use `apiFetch`.
2. If the session has ended, return a synthetic `401 {"error":"Unauthorized"}`.
3. If `admin_session` is stale: `outcome = await refreshSession("stale")`. If the outcome is `expired`, or the session is now ended, **return the synthetic 401 without sending**.
   - This stops, for example, an S3 upload for a dead session, because `/api/upload-url` itself is public.
   - It also avoids a burst of about 16 parallel 401s on Home.
4. `startedAt = Date.now()`; `res = await fetch(input, { credentials: "include", ...init })`. If the status is not 401, return `res`.
5. On 401, `await refreshSession("unauthorized", startedAt)`:
   - `refreshed`: retry **once** with the same `init`. All bodies are `JSON.stringify` strings, so they replay safely.
   - otherwise: return the original 401. The redirect is already running, or the caller's normal error path runs.
6. If the retry also returns 401: stop refreshing on 401 for 60 s (circuit breaker) and `console.error` once with a hint about `AUTH_COOKIE_SECURE` or the cookie Path. **Never loop.**

**`refreshSession(trigger, requestStartedAt)`:**
1. Return `expired` if the session has ended, and `failed` during the 10 s backoff after a transient failure.
2. **Per-tab single flight:** if a refresh is already in flight, return that promise. Clear it in `finally`.
3. Capture `generation`. Run under `navigator.locks.request("admin_auth_refresh", …)`:
   - Abort the lock wait after 20 s and then run without the lock, so a frozen tab cannot block the others.
   - Without Web Locks (plain-http origins other than localhost), run directly; the server's per-family lock and recovery cover the race.
   - If the TypeScript 5.0.2 DOM lib lacks the Web Locks types, declare a narrow local interface.
4. Inside the lock, re-read `admin_session`. If another tab refreshed after `requestStartedAt` (or, for `stale`/`resume`/`bootstrap`, the token is fresh again), return `refreshed` without a network call.
5. `fetch(apiHref("/api/auth/refresh"), { method: "POST", credentials: "include", cache: "no-store", headers: { "X-Admin-Auth": "1" } })`.
   - **No client-side abort.** ecom's rewrite proxy bounds it, and aborting a rotating refresh would lose its cookie.
6. If `generation` changed meanwhile (a login or logout happened in this tab), **discard** the result and return `failed`.
7. Classify the response:
   - **200:** `saveClientSession`, notify the listeners, return `refreshed`.
   - **401:** if `admin_session.refreshedAt` is later than `requestStartedAt` (or, when there is none, this refresh's own start time), another tab logged in or refreshed meanwhile, so return `refreshed`. Otherwise `markSessionEnded()`, `redirectToLogin("session_expired")` and return `expired`. If the code is `missing` right after a login, first `console.error` a cookie-misconfiguration hint.
   - **403 `cross_site`:** `console.error` a misconfiguration hint and return `failed`.
   - **Anything else** (5xx, network error, bad JSON): set `lastFailureAt` and return `failed`.
   - **Only a 401 from `/refresh` ever ends a session.**
8. The whole body is wrapped so that any exception (a localStorage `SecurityError`, a throwing listener, a Web Locks rejection) returns `failed`.

**Import graph:** `base.ts` imports `client-session.ts`, which imports `return-path.ts` and `@/constants/nav`. None of them imports `base.ts`.

### 10.4 Which fetch calls change

**Rule.** Every browser request to an **authenticated admin `/api/*` route** goes through `apiFetch`.
- Change `fetch(` to `apiFetch(` and add `apiFetch` to the existing `@/lib/httpclient/base` import.
- Keep URLs, headers, credentials, bodies, error messages and return values unchanged, including two quirks: `approvePayrollClient` sends a JSON header with no body, and `transferWarehouse` sends a body with no Content-Type.
- **Never monkey-patch `window.fetch`.** It would also catch Next's RSC and prefetch requests and the cross-origin S3 PUT.

**Converted calls: 71 in 16 files, plus 1 in `lib/s3.ts`.** The line numbers are verified.

| File (`lib/httpclient/`) | Lines |
|---|---|
| `attendance.client.ts` | 9, 15, 26, 37 |
| `auth.client.ts` | **only** 123 `getUsers`, 131 `getUserById`, 139 `updateUser` |
| `collection.client.ts` | 9, 15, 21, 32, 43 |
| `customer.client.ts` | 9, 15, 20, 31, 42 |
| `employee.client.ts` | 9, 15, 26, 37 |
| `invoice.client.ts` | 9, 15, 26, 37 |
| `order.client.ts` | 11, 17, 22, 27, 38, 49 |
| `payroll.client.ts` | 9, 17, 23, 33 |
| `product.client.ts` | 42, 48, 53, 64, 75 |
| `production.client.ts` | 9, 16, 22, 28, 39 |
| `setting.client.ts` | 10, 16 |
| `stock-change.client.ts` | 36, 42, 48, 59, 70 |
| `user-permission.client.ts` | 24, 35, 49 |
| `utility-usage.client.ts` | 46, 52, 60, 74, 85 |
| `utility.client.ts` | 9, 15, 26, 37 |
| `warehouse.client.ts` | 9, 15, 20, 31, 42, 56, 73 |
| `lib/s3.ts` | 42 (`/api/upload-url`) |

**Must stay raw `fetch`:**
- `auth.client.ts` `loginUser`, whose 401 means bad credentials.
- `registerUser`.
- `forgotPassword` and `resetPassword`: ecom depends on these endpoints, and the forms match the exact server messages.
- `logoutUser`.
- The refresh call inside `base.ts`.
- `lib/s3.ts:51`, the presigned cross-origin PUT, which must never carry credentials.
- `app/swagger/page.tsx:13` (public docs).
- `lib/services/emailService.ts:51` (server side).

**Acceptance check** (defined by function, not line): `grep -n "fetch(" lib/httpclient/*.ts lib/s3.ts` may show raw `fetch` only in:
- `auth.client.ts`: `loginUser`, `registerUser`, `forgotPassword`, `resetPassword`, `logoutUser`;
- `base.ts`: inside `apiFetch` and `refreshSession`;
- `s3.ts:51`.

**Unchanged on purpose:** the five getters without a `res.ok` check (`customer.client.ts:15`, `order.client.ts:17,22`, `product.client.ts:48`, `warehouse.client.ts:15`).

### 10.5 `lib/httpclient/auth.client.ts`

- `IAuthResponse` gains `session?: IAuthSession`.
- `loginUser`:
  - adds the header `X-Admin-Auth: 1` and `credentials: "include"`;
  - on `!ok`, `throw new ApiError(body.error || "Failed to login", response.status, body.code)`.
- `logoutUser`:
  - adds the same header and credentials, and returns `res.ok`, or `false` on a network error. Today it always returns `true`.
  - Callers run it under `withAuthLock` after `waitForPendingRefresh()` (§10.6), so a late refresh cannot re-create cookies.
- `registerUser`, `forgotPassword` and `resetPassword` stay untouched.

### 10.6 `contexts/auth-context.tsx`

**Types:** `login(user: ISessionUser, session: IAuthSession): void` and `logout(): Promise<void>`, which fixes the `() => void` declared at `:13`.

**Mount:**
- Hydrate `user` as today.
- If there is a stored user and `admin_session` is missing, belongs to another user, or is stale, run `void refreshSession("bootstrap")` without blocking rendering.
- Legacy sessions have no metadata, so they produce one 401 and a redirect with the message.

**This tab's refreshes:** subscribe with `onSessionRefreshed(({ user }) => …)`.
- Keep the same object when `id`, `email`, `username`, `role`, `active` and `lastLogin` are unchanged, so `ERPLayout` does not re-fetch.
- Bump a `sessionVersion` state.

**While a user is set:**
- **Resume checks:** on `visibilitychange` (to visible), `focus`, `pageshow` and `online`, run `if (isAccessTokenStale(readClientSession())) void refreshSession("resume")`.
- **Expiry timer** (effect on `[user?.id, sessionVersion]`):
  - `setTimeout` to `refreshExpiresAt + 1 s`, clamped to 2,147,483,647 ms and re-armed if it fires early because of the clamp.
  - When it fires, call `refreshSession("timer")`. A 401 redirects; a rotation by another tab just re-arms.
  - There is **no keep-alive:** an untouched tab never extends the session.
- **`storage` events:**
  - `admin_session` changed: bump `sessionVersion`.
  - `user` removed and the current page is not an auth page: read `admin_session_end`. If the reason is `session_expired`, `window.location.replace(buildLoginHref({ reason, next: current path }))`; if it is `logout`, `window.location.replace(ADMIN_ROUTES.login())`.
  - `user` set while this tab is on an auth page (a login in another tab): navigate to the page's validated `next`, or home.
  - `user` changed to a different id: `window.location.replace(location.href)`.

**`login(user, session)`:** `markSessionStarted()`, `saveClientSession(user, session)`, `setUser(user)`.

**`logout()`:**
1. `await waitForPendingRefresh()`.
2. Under `withAuthLock`: `markSessionEnded()`, then `await logoutUser()`, logging a failure.
3. `clearClientSession("logout")`.
4. `window.location.replace(ADMIN_ROUTES.login())`.

Don't call `setUser(null)` first: it races AuthGuard's 100 ms `router.push`.

### 10.7 `components/auth-guard.tsx`

- Take `publicRoutes` from `getAuthPagePaths()`.
- In the 100 ms timer, redirect with `router.replace(buildLoginHref({ next: current path }))`, so deep links survive login.
- Nothing else changes.

### 10.8 `components/erp-layout.tsx`

Change the permission effect's dependencies from `[user,]` to `[user?.id]` (`:54-58`), so a silent refresh does not re-fetch permissions and flash the overlay.

### 10.9 `constants/nav.ts`

`login: (query?: string) => adminHref("login", query)` (`:48`). Existing callers pass no argument, so this is backward compatible.

### 10.10 Login page and form

**`app/login/page.tsx`:** an async server component, copying `app/reset-password/page.tsx`.
- `interface ILoginPageProps { searchParams: Promise<{ next?: string | string[]; reason?: string | string[] }> }`.
- Validate with `getSafeReturnPath` and `parseLoginReason`, then render `<LoginForm nextPath reason />`.
- No `useSearchParams`: it would need a Suspense boundary for `pnpm build`.

**`components/auth/login-form.tsx`:**
- Add `interface ILoginFormProps { nextPath?: string; reason?: LoginReason }`.
- When `reason` is set and there is no error, show `<div role="status" className="text-amber-600 text-sm text-center">{t("login.sessionExpired")}</div>`.
- On success: `login(res.user!, res.session!)`, then `router.replace(nextPath ?? ADMIN_ROUTES.home())`.
- On error, map by status and **code**:
  - 401 → `t("login.invalidCredentials")`;
  - 403 with `code === "account_not_allowed"` → `t("login.accountNotAllowed")`;
  - anything else → `t("login.failed")`, plus `console.error` for `cross_site`.
  - This replaces the hard-coded English at `:39`.
- Remove the demo-credentials block and the auto-fill button (D12; if Phase 0 did not already).

### 10.11 `locales/auth.ts`

Add these keys. The file is already registered in `contexts/language-context.tsx`, and none of the keys exists yet.

| Key | en | vi |
|---|---|---|
| `login.sessionExpired` | Your session has expired. Please sign in again. | Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại. |
| `login.invalidCredentials` | Incorrect username or password. | Tên đăng nhập hoặc mật khẩu không đúng. |
| `login.accountNotAllowed` | This account is not allowed to sign in to the admin site. | Tài khoản này không được phép đăng nhập vào trang quản trị. |
| `login.failed` | Login failed. Please try again. | Đăng nhập thất bại. Vui lòng thử lại. |

---

## 11. Failure modes (what the user sees)

| Scenario | Behaviour |
|---|---|
| The access token expires while the user works | A pre-emptive or reactive refresh, then one retry. The user sees nothing |
| About 16 parallel calls need a token (Home) | One refresh per tab; the Web Lock plus the metadata re-check make it one across tabs |
| Several tabs refresh during the rotation week | The per-family DB lock serializes them. Later ones take the recovery path and get a working cookie. No logout |
| A rotation response is lost (network drop, tab closed, slow cold compile under `pnpm dev`) | The next refresh presents the old token, whose successor was never used, so recovery rotates again. No logout |
| `/refresh` returns 5xx, a lock timeout, the DB is down, or the network is offline | The user stays signed in. The call fails through its usual error path, and refresh backs off for 10 s |
| A tab is idle past the refresh expiry | The timer or a resume event gets a 401, and the browser lands on login with the message and `next` |
| Several tabs open when the session expires | Every tab lands on login with the message (the end marker). A login in one tab sends the others to their page |
| Wrong password | The login form shows the message. `/api/auth/*` is never intercepted |
| Password reset or change (admin or ecom), deactivation | The next refresh (within 15 min) returns 401 and the browser goes to login |
| Logout in one tab | The server revokes the family; the other tabs follow the `storage` event to login |
| Cookies not stored (Secure over http, wrong Path) | Circuit breaker plus client and server diagnostics; fix `AUTH_COOKIE_SECURE` or the base path |
| First load after deploy (a legacy session) | One login with the message, then back to the same page |

---

## 12. Phase 0: security hotfix (separate PR, recommended first)

**Branch:** `hotfix-users-api-auth` in admin, from the confirmed base. Commit subject: `hotfix: require super admin to update users. #Refs AP-<n>`.

1. **`app/api/users/[id]/route.ts` PUT:**
   - Take `req: NextRequest` and `interface IUserRouteContext { params: Promise<{ id: string }> }`.
   - `getUserFromRequest`, or 401.
   - `ensureDataSource()`.
   - Load the caller by `user.userId`. Require `role === super_admin` and `active !== false`, else 403 `{ error: "Forbidden" }`.
   - `UserSchema.safeParse`, else 400 `{ error: "Invalid input", details }`.
   - 404 `{ error: "Not found" }` when the target is missing.
   - Return the user **without** `password` or `passwordSalt`; tagged 500 on errors.
   - The only caller is the super-admin permissions page (`hooks/use-permissions.ts:52-55`), so real use does not change.
2. **`GET /api/users/[id]` and `GET /api/users`:** strip `password` and `passwordSalt` from every returned user. Their only consumers never read those fields.
3. **If D6 is approved:** add `lib/auth/session-policy.ts` (§8.4) and call `getAdminSessionDenial` in login after the password check, returning 403 `{ error: "Account is not allowed to sign in", code: "account_not_allowed" }`. It needs no table. Phase 1 reuses the same helper at refresh.
4. **If D12 is approved:** remove the demo-credentials block from the login form.
5. **Ops, before or right after deploying:**
   - A super admin reviews the `email`, `username` and `role` of every `super_admin` and `admin` row. Past abuse of the PUT cannot be detected from the data, because `repo.update` leaves no audit trail.
   - Check whether the demo account advertised on the login page exists in any environment; if it does, reset or deactivate it.
   - Confirm that production's `JWT_SECRET` is **not** the value hard-coded in the repo (compare hashes, never print it). If it is, rotate it now; everyone signs in once.

---

## 13. Implementation order and commits

**Step 0: prepare.**
1. Confirm D1: ticket number and base branch (`dev` and `main` have diverged). `admin/` is on a detached HEAD at `c849fc9` (= `origin/main`). Create `AP-<n>-admin-refresh-token` from the confirmed base.
   - If the base is `dev`: `admin/CLAUDE.md` exists only on `main` (commit `c849fc9`). Cherry-pick it or skip the doc commit.
2. Run `pnpm install` in `admin/` (node_modules is missing).
3. **Local stack:**
   - Create `ecom/.env` (from `ecom/.env.example`; compose already provides the core keys) and `pos/.env` (empty is fine). Compose refuses to start without them.
   - `docker compose up -d --build`, then `docker compose exec admin pnpm migration:run`. This is the **local** `db` service, which starts empty.
4. **Test users:**
   - Register at `/admin/register`, which creates `staff`. Then promote one account:
     `docker compose exec db psql -U postgres -d anphat_erp -c "update users set role='super_admin' where username='<you>'"`.
   - Keep a second, non-admin staff user for the permission tests.
5. Generate `AUTH_ACCESS_TOKEN_SECRET` into `admin/.env` locally. Never paste it into chat, a PR or logs.

**Phase 1 commits** (one PR in the admin repo, squash-merged):

| # | Contents | Subject |
|---|---|---|
| A | `types/enums.ts`, `types/auth.ts`, `types/index.ts`, the entity, `entities/index.ts`, `typeorm.ts`, and the migration (gen → review → run/revert/run) | `feat: add refresh tokens table. #Refs AP-<n>` |
| B | `constants/env.ts`, `.env.example`, `lib/auth/session-config.ts`, `lib/auth/session-policy.ts` (unless Phase 0 already added it), `lib/auth/jwt.ts`, `lib/auth/session-cookies.ts`, `lib/utils.request.ts`, `lib/services/refreshTokenService.ts`, `app/api/auth/auth.schema.ts`, the login/**refresh**/logout/register routes, `passwordResetService.ts`, and the 2 utility-usage lines | `feat: issue and rotate admin refresh tokens. #Refs AP-<n>` (the body justifies the cookie-authenticated `/api/auth/refresh`) |
| C | `lib/auth/return-path.ts`, `lib/auth/client-session.ts`, `constants/nav.ts`, `lib/httpclient/base.ts`, the 16 client files, `lib/s3.ts`, `auth.client.ts`, `auth-context.tsx`, `auth-guard.tsx`, `erp-layout.tsx`, `app/login/page.tsx`, `login-form.tsx`, `locales/auth.ts` | `feat: refresh admin session automatically. #Refs AP-<n>` |
| D | `admin/CLAUDE.md`: line 68 (`signJwt/verifyJwt` → the new functions), §4 Auth (lines 101-103, 115: cookies and the refresh flow), §6 HTTP client ("use `apiFetch`; raw `fetch` only for auth flows and cross-origin URLs"), line 349 (the PUT hole is fixed), line 354 (`verifyAccessToken`), and the replay invariant ("every handler calls `getUserFromRequest` before any side effect") | `doc: document admin refresh token session. #Refs AP-<n>` |

Commits B and C are not deployable on their own; they ship together in the same PR.

**Before opening the PR:**
- `pnpm exec tsc --noEmit`: the only type gate, because the build ignores TS errors.
- `pnpm build`, to confirm `/login` compiles as dynamic without a Suspense error.
  - ⚠️ First `docker compose stop admin`: the container bind-mounts `./admin`, so a host build clobbers the dev server's `.next`. Restart it afterwards with `docker compose up -d admin`.
- The §10.4 grep check.
- The §14 checklist in **vi and en**.

**The PR:**
- The description lists the new env keys by name only.
- Commits end with the Co-Authored-By trailer, and the PR body ends with the Claude Code line.

**After the merge:**
- **Root submodule bump:** only once the squash commit is on `origin/main` (`.gitmodules` tracks `main`; if the PR merged to `dev`, wait until dev reaches main). Check with `git -C admin log origin/main`, then `git submodule update --remote --merge admin`, then `git add admin`, then commit.
- **Root follow-up commit (D13):** remove the committed admin `JWT_SECRET` line from `docker-compose.yml`, and update root `CLAUDE.md` §4 (auth: new cookies and the role check) and §7 (the fixed holes).
- **Doc-only PRs on the same ticket:**
  - ecom: `ecom/CLAUDE.md:107`, the cookie description.
  - pos: `pos/CLAUDE.md:110` (the cookie list, plus the `admin_session`/`admin_session_end` localStorage keys) and `:127` (pos can no longer reuse admin's cookie; D8).

---

## 14. Manual verification

Always test through `http://localhost:3030/admin`.

**Tiny TTLs:** add these to `admin/.env`, then run `docker compose up -d --force-recreate admin`.
```
AUTH_ACCESS_TOKEN_TTL_SECONDS=30
AUTH_REFRESH_TOKEN_TTL_SECONDS=300
AUTH_REFRESH_TOKEN_RENEW_BEFORE_SECONDS=180
AUTH_REFRESH_TOKEN_REUSE_GRACE_SECONDS=10
```
The access token expires every 30 s, the refresh token lives 5 min, the rotation window opens 2 min after issue, and the grace is 10 s.

**DB view** (never select `token_hash`):
`docker compose exec db psql -U postgres -d anphat_erp -c "select user_id, family_id, created_at, expires_at, last_used_at, revoked_at, revoked_reason, replaced_by_id from refresh_tokens order by created_at desc limit 10;"`

**curl:** add `-H "X-Admin-Auth: 1"` to reach the handlers; leaving it out tests the guard.

**DevTools:** Network (Preserve log), Application → Cookies and Local Storage for `localhost:3030`. Run every UI case in **vi and en**.

1. **Login:**
   - `admin_access_token`: HttpOnly, Strict, Path `/admin`, about 30 s.
   - `admin_refresh_token`: HttpOnly, Strict, Path `/admin/api/auth`, about 5 min.
   - No Secure flag on http, and no `token` cookie.
   - localStorage has `user` and `admin_session` (timestamps only). The DB has 1 active row.
2. **Scoping:** requests to ecom (`/`) and `/pos` carry no admin cookies. `/admin/api/*` requests carry only the access cookie; `/admin/api/auth/*` requests also carry the refresh cookie.
3. **Silent refresh:** wait more than 30 s, then open another menu page or save something. Exactly one `POST /admin/api/auth/refresh` returns 200 and sets only `admin_access_token`. The calls succeed, with no toast and no access-denied card.
4. **Burst:** after expiry, open Home. Exactly one refresh, not about 16.
5. **Multiple tabs:** open 3 tabs; after expiry, focus each. At most one refresh per expiry across the tabs, and every tab keeps working.
6. **Rotation:** keep clicking every ~20 s until about 2.5 min after login.
   - A response has `session.rotated: true` and sets a new `admin_refresh_token`.
   - DB: the old row is `rotated`, and its `replaced_by_id` points at a new row in the same family.
   - The session outlives the original 5 min.
7. **Rotation race and recovery:** curl does not update the browser's cookie jar, which makes this easy to reproduce.
   - Just inside the rotation window (more than 2 min after login), copy the browser's `admin_refresh_token` value, R0, from DevTools. Keep it local.
   - Fire two refreshes at once with it: `curl -i -X POST -H "X-Admin-Auth: 1" -H "Cookie: admin_refresh_token=<R0>" http://localhost:3030/admin/api/auth/refresh`, twice in parallel.
   - Both return 200, and the DB shows the chain R0 → R1 → R2.
   - Then click in the browser, which still holds R0. Its refresh returns 200 through recovery and sets a fresh refresh cookie. **No logout.**
8. **Reuse detection:**
   - After check 7, wait for the next access expiry and click, so the browser uses its new refresh cookie once. The chain head is now "used".
   - Wait more than 10 s (the grace), then replay R0 with curl.
   - Expect 401 `reuse_detected` and the whole family revoked. The browser's next refresh then returns 401 and goes to login with the message.
9. **Idle expiry (en):**
   - Open `/admin/orders?page=2` and touch nothing for more than 5 min, with the tab visible.
   - Expect an automatic redirect to `/admin/login?reason=session_expired&next=%2Fadmin%2Forders%3Fpage%3D2` with the English message.
   - Log in and land back on `/admin/orders?page=2`. Repeat in vi.
10. **Two tabs at expiry:** both land on login with the message. Logging in from one tab sends the other to its page.
11. **Hidden tab or closed browser:** leave it for more than 5 min, then return. Expect login with the message, not a blocked page.
12. **Browser restart within the lifetime:** the session continues, because the cookies are persistent.
13. **Logout with a second tab open:**
    - The response clears all three cookies, each at its own Path.
    - DB: `logout`. The other tab goes to login.
    - Replaying the old refresh cookie with curl returns 401.
14. **Password reset:** in browser B, run forgot/reset for the same user, from admin or the ecom storefront (MailerSend must be configured).
    - DB: `password_reset`. Browser A goes to login within about 30 s.
    - Also run an **ecom** reset end to end (the cross-app contract).
15. **ecom change-password:** the next admin refresh returns 401 `password_changed`.
16. **Deactivation:** `update users set active=false where username='<test>'`.
    - The next refresh returns 401 `user_inactive`, and login shows `login.accountNotAllowed` in vi and en.
    - Restore the user afterwards.
17. **Customer (D6):** logging in with a customer account returns 403 with the not-allowed message.
18. **Cascade:**
    - Create a customer in admin, then `update users set role='staff'` for it and log in once, which creates refresh rows.
    - Set the role back to `customer`, then delete the customer in `/admin/customers`.
    - Expect 204 and the refresh rows gone.
19. **Guard:** these all return 403 `cross_site`:
    - `curl -i -X POST http://localhost:3030/admin/api/auth/refresh` (no header);
    - the same with `-H "X-Admin-Auth: 1" -H "Sec-Fetch-Site: cross-site"`;
    - a `text/plain` login POST without the header.

    None of them sets or clears cookies.
20. **Paths:**
    - `curl -i -X POST -H "X-Admin-Auth: 1" http://localhost:3030/admin/api/auth/refresh` returns 401 `missing`, with clearing `Set-Cookie` headers for Path `/admin`, `/admin/api/auth` and `/`.
    - A GET to the same URL returns 405.
21. **Transient failure:**
    - After access expiry, `docker compose stop db` and click something. Refresh returns 500: **no** redirect, and the normal error path runs.
    - `docker compose start db`. After 10 s the next action works.
22. **Wrong password:** shows `login.invalidCredentials` (vi/en), with no refresh request.
23. **Legacy session:**
    - Log in on the old build, then switch to the new build and reload.
    - Expect one redirect to login with the message; after logging in, the `token` cookie is gone.
24. **Phase 0 checks:**
    - PUT without a cookie returns 401; as staff it returns 403.
    - As super admin, a role change on `/admin/permissions` still works.
    - No user response (list or single) contains password fields.
25. **Open redirect:** each of these lands on home after login: `next=https://example.com`, `next=//example.com`, `next=/admin/login`, `next=/pos`, `next=/admin/api/orders`.
26. **Register:** succeeds, sets no cookie, and lands on login.
27. **Cross-app regression:** ecom login, ecom forgot/reset, brand settings, and `/pos` all work.
28. **Standalone mode (run LAST, in an incognito window):**
    - Stop the admin container, then run `pnpm dev` on the host with `NEXT_PUBLIC_BASE_ZONE=` empty **and the local `DATABASE_URL`** (the commented line in `admin/.env`) set for that command only.
    - The cookie paths are `/` and `/api/auth`, and checks 1, 3 and 13 pass.
    - Close the window afterwards. Cookies are per host, not per port, so standalone cookies would also reach ecom on :3030.
29. **Hygiene:** no token or cookie values appear in the admin logs or the browser console.
30. **Tooling:** `pnpm exec tsc --noEmit`, `pnpm build`, the migration run/revert/run cycle, and the §10.4 grep check.

Afterwards, remove the test TTLs and recreate the container.

---

## 15. Rollout, backward compatibility, rollback

1. **Before deploying:**
   - Phase 0 is live, and its ops checks are done (§12.5).
   - Run `select role, active, count(*) from users group by 1,2;` to see who the allowlist (D6) will lock out.
   - Provision `AUTH_ACCESS_TOKEN_SECRET` in every deployed environment, and set `AUTH_COOKIE_SECURE=true` where the environment is HTTPS.
   - Tell us whether the Neon "Dev" DB backs a deployed environment, so it gets the migration too.
2. **Order (a hard gate): the migration first, then the admin code.**
   - Code without the table breaks admin login **and** the ecom/admin password reset, both with a 500.
   - ecom and pos need no deploy.
3. **Users:**
   - Everyone signs in once (prompted with the message and a return to their page).
   - Tabs still running the old JavaScript stay broken until they reload.
   - Scripts using the old `token` cookie or old Bearer tokens must log in again.
4. **Monitoring:**
   - `[api/auth/refresh]` errors and the counts per `code`.
   - `reuse_detected` warnings, a signal rather than proof.
   - "refresh cookie missing while access cookie present" warnings, which mean a Secure/Path misconfiguration.
   - Growth of `refresh_tokens`.
5. **Follow-ups:**
   - After 30 days or more, remove the legacy `token` clearing (marked with a TODO).
   - The root commit for D13.
6. **Rollback:**
   - Revert the squash commit, and optionally run `pnpm migration:revert`, which drops the table and the enum type.
   - The old code reads only `token`, which the new code cleared. Users with a stale localStorage `user` then see the old "blocked" state; they must open `/admin/login` and sign in again.

---

## 16. Risks

- **Shared origin.** An XSS anywhere on the origin (ecom, pos or admin) can call `/admin/api/*`, including `/refresh`: those are same-origin requests. Path scoping and SameSite are not boundaries between the zones.
- **Stateless access tokens.** Revocation reaches the API only within the access TTL (15 min).
- **Reuse detection works only around rotations.** With the requested rule (rotate only in the last week), a stolen refresh cookie can be used alongside the victim's for about 23 days without any signal (D4 has the alternative).
- **Server pages still render ERP data without auth.** A future page-level check can read `admin_access_token` with `verifyAccessToken`, but it cannot refresh inside an RSC.
- **Misconfiguration:**
  - a missing or reused secret: login returns 500 (fail closed);
  - a wrong base path: the refresh cookie is never sent;
  - Secure over http: the cookies are dropped.

  Mitigated by the single cookie helper, the diagnostics, and checks 1, 2, 20 and 28. `NEXT_PUBLIC_BASE_ZONE` must be the same at build and at run time, because cookie paths are computed on the server and fetch URLs are inlined into the client bundle.
- **Behaviour changes:**
  - one forced re-login at deploy;
  - customers and inactive users are locked out of admin (D6);
  - register no longer sets a cookie;
  - a session revoked mid-edit redirects and discards unsaved input. The checks on focus and visibility make this rare.
- **No Web Locks** on plain-http origins other than localhost: the per-tab single flight, the per-family DB lock and recovery cover this.
- **`pnpm dev` in production** (`Dockerfile:20`): the first request to each route compiles slowly. This is why the client never aborts a refresh.
- **Unverified until `pnpm install`:** `foreignKeyConstraintName` in TypeORM 0.3.24 and the Web Locks types in TypeScript 5.0.2. Both have fallbacks.

---

## 17. Out of scope (separate tickets)

- **Server-page auth or `middleware.ts`.**
- **ecom writes to `users`** (S6): the register upsert by client `userId`, and the guest-order upsert that blanks passwords.
- **Admin register** is public and creates active staff users. `upload-url` is public. Login has no rate limiting or lockout.
- **Role or permission checks** on the other ~70 API handlers. `GET /api/users` also does not whitelist `sortBy`.
- **The pos copy of the leaked secret fallback** (`pos/constants/env.ts`), which ships to pos browsers.
- **Session features:** "sign out everywhere", an active-sessions UI, an absolute maximum session age.
- **Client clean-ups:**
  - ERPLayout still shows access denied for non-auth 5xx errors;
  - 13 hooks use the dead toast module;
  - five getters lack `res.ok`.

---

## 18. Decisions to confirm (recommended default first)

| # | Decision | Recommended default |
|---|---|---|
| D1 | Jira ticket number and base branch (`dev` vs `main`, which have diverged) | **Required; no default** |
| D2 | Access-token lifetime | 15 minutes |
| D3 | Meaning of "1 month" | 30 days |
| D4 | Renewal rule | Exactly as specified: a new refresh token only when 7 days or less remain. Alternative: change the token on every refresh but keep its expiry, extending only in the last week. That gives reuse detection all month without changing the session lifetime, at the cost of more rows and rotations |
| D5 | A new signing secret `AUTH_ACCESS_TOKEN_SECRET`: required, no fallback, must differ from the leaked `JWT_SECRET` | Yes (causes one forced re-login, which happens anyway) |
| D6 | Allow only `super_admin`, `admin`, `manager` and `staff` with `active=true` to sign in to admin, blocking customers | Yes, ideally already in Phase 0. Confirm that no customer account legitimately uses admin |
| D7 | Ship Phase 0 (users PUT auth, strip password hashes) as a hotfix before this ticket | Yes |
| D8 | Cookie names and paths (`admin_access_token` at `/admin`, `admin_refresh_token` at `/admin/api/auth`, SameSite=Strict). pos can then no longer reuse admin's cookie | Yes; pos gets its own auth design later |
| D9 | Secure flag policy | `auto`, and `true` in production. **Tell me:** is production HTTPS end to end, and how is it deployed? The Dockerfile runs `pnpm dev` |
| D10 | Return to the previous page after re-login (validated `next`) | Yes |
| D11 | An untouched open tab does not extend the session (no keep-alive) | Yes |
| D12 | Remove the login page's demo-credentials block; `register` stops setting a cookie | Yes, both |
| D13 | Root follow-up: remove the committed admin `JWT_SECRET` from `docker-compose.yml`; update the root, ecom and pos CLAUDE.md docs | Yes, after rollout |
| D14 | Delete the unused `JWT_SECRET` key and its hard-coded fallback from `admin/constants/env.ts` (`admin/CLAUDE.md` says to leave it unless you approve) | Yes, in commit B (it only ships a secret to browsers) |
| D15 | Local DB for development: docker compose (local `db`). Never run migrations against the Neon "Dev" DB from the host. Does that Neon DB back a deployed environment? | docker compose; **tell me** about Neon |
