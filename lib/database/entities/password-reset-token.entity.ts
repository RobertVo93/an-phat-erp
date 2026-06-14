import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { UserEntity } from "@/lib/database/entities/user.entity";

@Entity({ name: "password_reset_tokens" })
export class PasswordResetTokenEntity extends BaseEntity {
  @Column({ name: "user_id", type: "uuid", nullable: false })
  userId!: string;

  @Column({ name: "token_hash", type: "varchar", length: 255, nullable: false })
  tokenHash!: string;

  @Column({ name: "expires_at", type: "timestamp", nullable: false })
  expiresAt!: Date;

  @Column({ name: "used_at", type: "timestamp", nullable: true })
  usedAt?: Date;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;
}
