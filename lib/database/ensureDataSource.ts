import { AppDataSource } from "./typeorm";

export async function ensureDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
} 