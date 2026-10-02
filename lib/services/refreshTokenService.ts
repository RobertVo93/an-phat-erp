import crypto from "crypto";
import { EntityManager, IsNull, LessThan, Repository } from "typeorm";
import { AppDataSource } from "@/lib/database/typeorm";
import { RefreshTokenEntity } from "@/lib/database/entities/refresh-token.entity";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { getSessionConfig } from "@/lib/auth/session-config";
import { getAdminSessionDenial } from "@/lib/auth/session-policy";
import { RefreshTokenRevokeReason } from "@/types/enums";
import type { IUser } from "@/types";

const LOCK_TIMEOUT = "5s";
const MAX_CHAIN_HOPS = 20;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const CLEANUP_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
let lastCleanupAt = 0;

export type RefreshFailureCode =
  | "not_found"
  | "expired"
  | "revoked"
  | "reuse_detected"
  | "user_inactive"
  | "role_not_allowed"
  | "password_changed";

export interface IIssuedRefreshToken {
  id: string;
  token: string;
  familyId: string;
  expiresAt: Date;
}

export type RefreshSessionResult =
  | { ok: true; user: IUser; familyId: string; refreshExpiresAt: Date; rotatedToken?: IIssuedRefreshToken }
  | { ok: false; code: RefreshFailureCode; revokedReason?: RefreshTokenRevokeReason; userId?: string; familyId?: string };

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getPasswordFingerprint(passwordHash?: string | null): string {
  return crypto.createHash("sha256").update(passwordHash ?? "").digest("hex");
}

// A lock wait becomes an error (500, which the client treats as transient) instead of a hung request.
async function setLockTimeout(manager: EntityManager): Promise<void> {
  await manager.query(`SET LOCAL lock_timeout = '${LOCK_TIMEOUT}'`);
}

// Serializes every change to one session family (refresh, rotation, recovery, revocation) until commit.
async function lockFamily(manager: EntityManager, familyId: string): Promise<void> {
  await manager.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [familyId]);
}

async function revokeFamilyLocked(
  manager: EntityManager,
  familyId: string,
  reason: RefreshTokenRevokeReason
): Promise<number> {
  await lockFamily(manager, familyId);
  const repo = manager.getRepository(RefreshTokenEntity);
  // Queried after the lock, so successors committed by an earlier rotation are included.
  const rows = await repo.find({ where: { familyId, revokedAt: IsNull() }, order: { id: "ASC" } });
  if (!rows.length) return 0;

  const now = new Date();
  rows.forEach((row) => {
    row.revokedAt = now;
    row.revokedReason = reason;
  });
  await repo.save(rows);
  return rows.length;
}

async function findChainHead(
  repo: Repository<RefreshTokenEntity>,
  row: RefreshTokenEntity
): Promise<RefreshTokenEntity | null> {
  let current: RefreshTokenEntity | null = row;
  for (let hop = 0; hop < MAX_CHAIN_HOPS; hop += 1) {
    if (!current || current.revokedReason !== RefreshTokenRevokeReason.rotated || !current.replacedById) {
      return current;
    }
    current = await repo.findOne({ where: { id: current.replacedById } });
  }
  return null;
}

export async function createRefreshTokenService(
  input: { userId: string; passwordHash?: string | null; familyId?: string },
  manager?: EntityManager
): Promise<IIssuedRefreshToken> {
  const { refreshTokenTtlSeconds } = getSessionConfig();
  const repo = manager ? manager.getRepository(RefreshTokenEntity) : AppDataSource.getRepository(RefreshTokenEntity);

  const token = crypto.randomBytes(32).toString("base64url");
  const familyId = input.familyId ?? crypto.randomUUID();
  const expiresAt = new Date(Date.now() + refreshTokenTtlSeconds * 1000);

  const saved = await repo.save(
    repo.create({
      userId: input.userId,
      familyId,
      tokenHash: hashRefreshToken(token),
      passwordFingerprint: getPasswordFingerprint(input.passwordHash),
      expiresAt,
      createdBy: input.userId,
    })
  );

  return { id: saved.id, token, familyId, expiresAt };
}

/**
 * Validates a presented refresh token and, when it has <= RENEW_BEFORE left, rotates it.
 * A rotated token is accepted again only while its chain head is unused or within the reuse grace
 * (two tabs racing, or a rotation response that never reached the browser); the head is then rotated
 * again so the browser always ends up with a working cookie. Any other replay revokes the family.
 */
export async function refreshSessionService(token: string): Promise<RefreshSessionResult> {
  const { refreshTokenRenewBeforeSeconds, refreshTokenReuseGraceSeconds } = getSessionConfig();
  const tokenHash = hashRefreshToken(token);

  return AppDataSource.transaction(async (manager) => {
    await setLockTimeout(manager);
    const repo = manager.getRepository(RefreshTokenEntity);

    const found = await repo.findOne({ where: { tokenHash } });
    if (!found) return { ok: false, code: "not_found" };

    await lockFamily(manager, found.familyId);
    const presented = await repo.findOne({ where: { id: found.id } });
    if (!presented) return { ok: false, code: "not_found" };

    const { userId, familyId } = presented;
    const now = new Date();
    if (presented.expiresAt.getTime() <= now.getTime()) {
      return { ok: false, code: "expired", userId, familyId };
    }

    let current = presented;
    let mustRotate = false;
    if (presented.revokedAt) {
      if (presented.revokedReason !== RefreshTokenRevokeReason.rotated) {
        return { ok: false, code: "revoked", revokedReason: presented.revokedReason ?? undefined, userId, familyId };
      }

      const head = await findChainHead(repo, presented);
      if (!head || head.revokedAt || head.expiresAt.getTime() <= now.getTime()) {
        return { ok: false, code: "revoked", revokedReason: head?.revokedReason ?? undefined, userId, familyId };
      }

      const inGrace = now.getTime() - presented.revokedAt.getTime() <= refreshTokenReuseGraceSeconds * 1000;
      if (head.lastUsedAt && !inGrace) {
        await revokeFamilyLocked(manager, familyId, RefreshTokenRevokeReason.reuse_detected);
        return { ok: false, code: "reuse_detected", userId, familyId };
      }

      current = head;
      mustRotate = true;
    }

    const user = await manager.getRepository(UserEntity).findOne({ where: { id: current.userId } });
    if (!user) return { ok: false, code: "not_found", userId, familyId };

    const denial =
      getAdminSessionDenial(user) ??
      (current.passwordFingerprint !== getPasswordFingerprint(user.password) ? "password_changed" : null);
    if (denial) {
      // Return instead of throwing so the revocation commits.
      await revokeFamilyLocked(manager, familyId, RefreshTokenRevokeReason[denial]);
      return { ok: false, code: denial, userId, familyId };
    }

    current.lastUsedAt = now;
    const remainingMs = current.expiresAt.getTime() - now.getTime();
    if (mustRotate || remainingMs <= refreshTokenRenewBeforeSeconds * 1000) {
      const next = await createRefreshTokenService(
        { userId: current.userId, passwordHash: user.password, familyId },
        manager
      );
      current.revokedAt = now;
      current.revokedReason = RefreshTokenRevokeReason.rotated;
      current.replacedById = next.id;
      await repo.save(current);
      return { ok: true, user, familyId, refreshExpiresAt: next.expiresAt, rotatedToken: next };
    }

    await repo.save(current);
    return { ok: true, user, familyId, refreshExpiresAt: current.expiresAt };
  });
}

// Logout and re-login (superseded): revoke the whole family of the presented token.
export async function revokeRefreshTokenFamilyService(
  token: string,
  reason: RefreshTokenRevokeReason
): Promise<boolean> {
  const tokenHash = hashRefreshToken(token);
  return AppDataSource.transaction(async (manager) => {
    await setLockTimeout(manager);
    const found = await manager.getRepository(RefreshTokenEntity).findOne({ where: { tokenHash } });
    if (!found) return false;
    await revokeFamilyLocked(manager, found.familyId, reason);
    return true;
  });
}

// Password reset, deactivation: revoke every session of the user. Pass the caller's manager to join its transaction.
export async function revokeUserRefreshTokensService(
  userId: string,
  reason: RefreshTokenRevokeReason,
  manager?: EntityManager
): Promise<number> {
  const run = async (txManager: EntityManager) => {
    await setLockTimeout(txManager);
    const rows = await txManager.getRepository(RefreshTokenEntity).find({
      select: { id: true, familyId: true },
      where: { userId, revokedAt: IsNull() },
    });
    // Sorted so two concurrent revocations take the family locks in the same order.
    const familyIds = Array.from(new Set(rows.map((row) => row.familyId))).sort();
    let revoked = 0;
    for (const familyId of familyIds) {
      revoked += await revokeFamilyLocked(txManager, familyId, reason);
    }
    return revoked;
  };

  return manager ? run(manager) : AppDataSource.transaction(run);
}

// Deletes rows that expired more than 7 days ago; runs at most once per hour per server process.
export async function cleanupExpiredRefreshTokensService(): Promise<number | null> {
  if (Date.now() - lastCleanupAt < CLEANUP_INTERVAL_MS) return null;
  lastCleanupAt = Date.now();

  const cutoff = new Date(Date.now() - CLEANUP_RETENTION_MS);
  const result = await AppDataSource.getRepository(RefreshTokenEntity).delete({ expiresAt: LessThan(cutoff) });
  return result.affected ?? 0;
}
