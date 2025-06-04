import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserRole } from "@/types/enums";
import { IUser } from "@/types/user";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity implements IUser {
    @Column({ type: "varchar", length: 255, nullable: false })
    email?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    username?: string;

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
} 