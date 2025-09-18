import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { UserEntity } from "@/lib/database/entities";
import { type IUser, UserPagePermission as IUserPagePermission } from "@/types";

@Entity({ name: "user_page_permissions" })
export class UserPagePermissionEntity extends BaseEntity implements IUserPagePermission {
  @Column({ type: "varchar", length: 255, nullable: false })
  userId!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  pageId!: string;

  @Column({ type: "boolean", default: false, nullable: false })
  granted!: boolean;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: IUser;
}