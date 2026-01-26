import { Customer as ICustomer } from '@/types';
import { IBase } from "./base.interface";
import { UserRole, Gender } from "./enums";
import { UserPagePermission } from "./user-permission";

export interface IUser extends IBase {
  fullName?: string
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  passwordSalt?: string;
  role?: UserRole;
  active?: boolean;
  lastLogin?: Date;
  avatar?: string
  gender?: Gender

  // Permissions
  permissions?: UserPagePermission[];
  customer?: ICustomer
}