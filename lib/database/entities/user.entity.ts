import { Entity, Column, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserPagePermissionEntity } from "./user-page-permission.entity";
import { UtilityUsageEntity } from "./utility-usage.entity";
import { UserRole, Gender } from "@/types/enums";
import type { Customer as ICustomer, UserPagePermission as IUserPagePermission, IUser, IUtilityUsage } from "@/types";
import { CustomerEntity } from "./customer.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity implements IUser {
    @Column({ type: "varchar", length: 255, nullable: false, unique: true })
    username?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    fullName?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    phone?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    password?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    passwordSalt?: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.staff, nullable: false })
    role?: UserRole;

    @Column({ type: "boolean", default: true, nullable: false })
    active?: boolean;

    @Column({ type: "timestamp", nullable: true })
    lastLogin?: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    avatar?: string;

    @Column({ type: "enum", enum: Gender, default: Gender.male, nullable: false })
    gender?: Gender;

    ///Relation fields
    @OneToMany(() => UserPagePermissionEntity, (permission) => permission.user, { cascade: true, nullable: true })
    permissions?: IUserPagePermission[];

    @OneToOne(() => CustomerEntity, (customer) => customer.user, { nullable: true })
    customer?: ICustomer;

    @OneToMany(() => UtilityUsageEntity, (usage) => usage.recorder, { nullable: true })
    recordedUtilityUsages?: IUtilityUsage[];

    @OneToMany(() => UtilityUsageEntity, (usage) => usage.approver, { nullable: true })
    approvedUtilityUsages?: IUtilityUsage[];
} 
