import { IBase } from "./base.interface";
import { UserRole } from "./enums";

export interface IUser extends IBase {
  username?: string;
  email?: string;
  password?: string;
  passwordSalt?: string;
  role?: UserRole;
  active?: boolean;
  lastLogin?: Date;
}