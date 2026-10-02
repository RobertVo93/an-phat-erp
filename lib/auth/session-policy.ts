import { UserRole } from "@/types/enums";
import type { IUser } from "@/types";

// Allowlist: a role added to the shared enum later is denied until it is listed here.
export const ADMIN_SESSION_ROLES: readonly UserRole[] = [
  UserRole.super_admin,
  UserRole.admin,
  UserRole.manager,
  UserRole.staff,
];

export type AdminSessionDenial = "user_inactive" | "role_not_allowed";

export function getAdminSessionDenial(user: Pick<IUser, "active" | "role">): AdminSessionDenial | null {
  if (user.active === false) return "user_inactive";
  if (!user.role || !ADMIN_SESSION_ROLES.includes(user.role)) return "role_not_allowed";
  return null;
}
