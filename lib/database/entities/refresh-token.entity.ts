import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { RefreshTokenRevokeReason } from "@/types/enums";
import type { IRefreshToken, IUser } from "@/types";

@Entity({ name: "refresh_tokens" })
@Unique("UQ_refresh_tokens_token_hash", ["tokenHash"])
@Index("IDX_refresh_tokens_user_id", ["userId"])
@Index("IDX_refresh_tokens_family_id", ["familyId"])
@Index("IDX_refresh_tokens_expires_at", ["expiresAt"])
export class RefreshTokenEntity extends BaseEntity implements IRefreshToken {
  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  // Every login starts a family; rotations stay in it. Logout and reuse detection revoke the whole family.
  @Column({ name: "family_id", type: "uuid", nullable: false })
  familyId!: string;

  // sha256 hex of the opaque token; the raw value is only ever in the cookie.
  @Column({ name: "token_hash", type: "varchar", length: 64, nullable: false })
  tokenHash!: string;

  // sha256 hex of users.password when issued; any password change invalidates the token.
  @Column({ name: "password_fingerprint", type: "varchar", length: 64, nullable: false })
  passwordFingerprint!: string;

  @Column({ name: "expires_at", type: "timestamp", nullable: false })
  expiresAt!: Date;

  @Column({ name: "last_used_at", type: "timestamp", nullable: true })
  lastUsedAt?: Date | null;

  @Column({ name: "revoked_at", type: "timestamp", nullable: true })
  revokedAt?: Date | null;

  @Column({
    name: "revoked_reason",
    type: "enum",
    enum: RefreshTokenRevokeReason,
    enumName: "refresh_tokens_revoked_reason_enum",
    nullable: true,
  })
  revokedReason?: RefreshTokenRevokeReason | null;

  // Plain id of the token that replaced this one on rotation (no FK).
  @Column({ name: "replaced_by_id", type: "uuid", nullable: true })
  replacedById?: string | null;

  //////Related fields//////
  @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id", foreignKeyConstraintName: "FK_refresh_tokens_user_id" })
  user?: IUser;
}
