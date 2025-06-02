import { DataSource } from "typeorm";
import "reflect-metadata";
import { TestEntity } from "@/lib/database/entities/TestEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true, // set to false in production and use migrations
  logging: false,
  entities: [TestEntity],
  ssl: { rejectUnauthorized: false }, // required for Neon
}); 