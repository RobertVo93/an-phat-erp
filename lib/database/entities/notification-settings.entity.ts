import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { INotificationSettings } from "@/types/notification-settings.interface";
import type { IUser } from "@/types";

@Entity({ name: "notification_settings" })
export class NotificationSettingsEntity extends BaseEntity implements INotificationSettings {
  @OneToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: IUser;

  // notification types
  @Column({ type: "boolean", default: true })
  orderEnabled!: boolean;

  @Column({ type: "boolean", default: true })
  promotionEnabled!: boolean;

  // display channels
  @Column({ type: "boolean", default: true })
  inappEnabled!: boolean;

  @Column({ type: "boolean", default: false })
  emailEnabled!: boolean;

  @Column({ type: "boolean", default: false })
  smsEnabled!: boolean;

  @Column({ type: "timestamp", nullable: true })
  muteUntil?: Date;
}
