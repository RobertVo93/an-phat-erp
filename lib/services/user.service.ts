import { AppDataSource } from "@/lib/database/typeorm";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { UsernameType, UserRole } from "@/types/enums";
import { IUser } from "@/types/user";
import { hash, genSalt, compare } from "bcryptjs";
import { checkUsernameType } from "@/lib/utils";

export class UserService {
  private userRepository = AppDataSource.getRepository(UserEntity);

  async verifyUser(username: string, password: string): Promise<IUser | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    const isPasswordValid = await compare(password, user.password!);
    return isPasswordValid ? user : null;
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    await ensureDataSource();

    if (userData.password) {
      const salt = await genSalt(10);
      userData.password = await hash(userData.password, salt);
      userData.passwordSalt = salt;
    }
    const checkUsername = checkUsernameType(userData.username!)

    const user = this.userRepository.create({
      ...userData,
      email: checkUsername === UsernameType.email ? userData.username : userData.email || '',
      phone: checkUsername === UsernameType.phone ? userData.username : userData.phone || '',
    });
    return await this.userRepository.save(user);
  }

  async getUserById(id: string, relations?: ("roles" | "permissions")[]): Promise<IUser | null> {
    await ensureDataSource();
    return await this.userRepository.findOne({
      where: { id },
      relations: relations
    });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    await ensureDataSource();
    return await this.userRepository.findOneBy({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    await ensureDataSource();
    return await this.userRepository.findOneBy({ username });
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    await ensureDataSource();

    if (userData.password) {
      const salt = await genSalt(10);
      userData.password = await hash(userData.password, salt);
      userData.passwordSalt = salt;
    }

    await this.userRepository.update(id, userData);
    return await this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    await ensureDataSource();
    await this.userRepository.update(id, { active: false });
    return true;
  }

  async getAllUsers(): Promise<IUser[]> {
    await ensureDataSource();
    return await this.userRepository.find();
  }

  async getUsersByRole(role: UserRole): Promise<IUser[]> {
    await ensureDataSource();
    return await this.userRepository.findBy({ role });
  }

  async updateLastLogin(id: string): Promise<void> {
    await ensureDataSource();
    await this.userRepository.update(id, { lastLogin: new Date() });
  }

  async getUsersWithRelations(search?: string, role?: string, sortBy?: string, sortOrder?: "asc" | "desc", skip?: number, limit?: number, relations?: string[]): Promise<{ users: IUser[], total: number }> {
    await ensureDataSource();
    const queryBuilder = AppDataSource.getRepository(UserEntity)
      .createQueryBuilder("user")

    if (relations?.includes("permissions")) {
      queryBuilder.leftJoinAndSelect("user.permissions", "permissions");
    }
    if (relations?.includes("roles")) {
      queryBuilder.leftJoinAndSelect("user.roles", "roles");
    }
    if (search) {
      queryBuilder.where("LOWER(user.username) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search)", { search: `%${search}%` });
    }

    if (role) {
      queryBuilder.andWhere("user.role = :role", { role });
    }

    if (sortBy) {
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder?.toUpperCase() as "ASC" | "DESC");
    }

    if (skip !== undefined) {
      queryBuilder.skip(skip);
    }

    if (limit !== undefined) {
      queryBuilder.take(limit);
    }

    const [users, total] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount()
    ]);
    return { users, total };
  }
}
