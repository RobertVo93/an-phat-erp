import type { IBase } from "./base.interface";
import type { IUser } from "./user";
import type { RefreshTokenRevokeReason } from "./enums";

export interface IRefreshToken extends IBase {
  userId?: string;
  familyId?: string;
  tokenHash?: string;
  passwordFingerprint?: string;
  expiresAt?: Date;
  lastUsedAt?: Date | null;
  revokedAt?: Date | null;
  revokedReason?: RefreshTokenRevokeReason | null;
  replacedById?: string | null;
  user?: IUser;
}

// The user fields the login and refresh responses expose (never password fields).
export type ISessionUser = Pick<IUser, "id" | "email" | "username" | "role" | "active" | "lastLogin">;

// Lifetimes are relative seconds, so the client's clock skew does not matter.
export interface IAuthSession {
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  rotated?: boolean;
}

export interface IAuthSessionResponse {
  success: true;
  user: ISessionUser;
  session: IAuthSession;
}
