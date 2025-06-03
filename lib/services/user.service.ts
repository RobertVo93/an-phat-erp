import { AppDataSource } from "@/lib/database/typeorm";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { UserRole } from "@/types/enums";
import { IUser } from "@/types/user";
import { hash, genSalt, compare } from "bcryptjs";

export class UserService {
  private userRepository = AppDataSource.getRepository(UserEntity);

  async verifyUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.getUserByEmail(email);
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

    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<IUser | null> {
    await ensureDataSource();
    return await this.userRepository.findOneBy({ id });
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
      userData.password = await hash(userData.password, 10);
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
}
