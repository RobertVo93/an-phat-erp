import { AppDataSource } from "@/lib/database/typeorm";
import { UserPagePermissionEntity } from "@/lib/database/entities/user-page-permission.entity";
import { UserService } from "./user.service";

export async function getPermissionsByUser(userId: string) {
  const repo = AppDataSource.getRepository(UserPagePermissionEntity);
  return repo.findBy({ userId });
}

export async function setUserPagePermissions(userId: string, permissions: { pageId: string; granted: boolean }[]) {
  const repo = AppDataSource.getRepository(UserPagePermissionEntity);
  const userService = new UserService();
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  // Remove existing permissions for user
  await repo.delete({ userId });
  // Add new permissions
  const newPermissions = permissions.map((p) => repo.create({ userId, user, ...p }));
  return repo.save(newPermissions);
}

export async function deleteUserPagePermission(userId: string, pageId: string) {
  const repo = AppDataSource.getRepository(UserPagePermissionEntity);
  return repo.delete({ userId, pageId });
} 