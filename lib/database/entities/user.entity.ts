import { Entity, Column, OneToMany, OneToOne } from "typeorm";
import { BaseEntity } from "@/lib/database/entities/base.entity";
import { CustomerEntity, UserPagePermissionEntity } from "@/lib/database/entities";
import { UserRole } from "@/types/enums";
import type { UserPagePermission as IUserPagePermission, IUser, Customer as ICustomer } from "@/types";

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

    @OneToMany(() => UserPagePermissionEntity, (permission) => permission.user, { cascade: true, nullable: true })
    permissions?: IUserPagePermission[];

    @OneToOne(() => CustomerEntity, (customer) => customer.user, { nullable: true })
    customer?: CustomerEntity;
} 