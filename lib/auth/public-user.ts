import type { IUser } from "@/types";

export type PublicUser<T extends IUser = IUser> = Omit<T, "password" | "passwordSalt">;

// Never send password hashes or salts to the browser.
export function toPublicUser<T extends IUser>(user: T): PublicUser<T> {
  const { password: _password, passwordSalt: _passwordSalt, ...publicUser } = user;
  return publicUser;
}
