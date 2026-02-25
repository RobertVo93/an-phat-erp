import { Entity, Column, ManyToOne, JoinColumn, Index } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { UserEntity } from "@/lib/database/entities";
import { NotificationType } from "@/types/enums";
import type { INotification } from "@/types";

@Entity({ name: "notifications" })
@Index("IDX_NOTIF_DEDUPLICATION", ["userId", "type", "deduplicationKey"], { unique: true, where: '"deduplicationKey" IS NOT NULL' })
export class NotificationEntity extends BaseEntity implements INotification {
    @Column({ type: "enum", enum: NotificationType, nullable: false })
    type?: NotificationType;

    @Column({ type: "varchar", length: 255, nullable: false })
    title?: string;

    @Column({ type: "text", nullable: false })
    content?: string;

    @Column({ type: "jsonb", nullable: true })
    data?: Record<string, any>;

    @Column({ type: "text", nullable: true})
    url?: string;

    @Column({ type: "boolean", default: false, nullable: false })
    isRead?: boolean;

    @Column({ type: "timestamp", nullable: true })
    readAt?: Date;

    @Column({ type: "varchar", length: 100, nullable: true })
    deduplicationKey?: string;

    @Column({ type: "uuid", nullable: false })
    userId?: string;

    @ManyToOne(() => UserEntity, (user) => user.id, { nullable: false, onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user?: UserEntity;
}