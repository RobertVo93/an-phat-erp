import { IBase } from "./base.interface";
import { UserRole } from "./enums";
import { UserPagePermission } from "./user-permission";

export interface IUser extends IBase {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  passwordSalt?: string;
  role?: UserRole;
  active?: boolean;
  lastLogin?: Date;

  // Permissions
  permissions?: UserPagePermission[];
}