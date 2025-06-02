import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database/typeorm";
import { TestEntity } from "@/lib/database/entities/TestEntity";

export async function GET() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();

  // Create a new test row
  const repo = AppDataSource.getRepository(TestEntity);
  const test = repo.create({ name: "Hello Neon!" });
  await repo.save(test);

  // Fetch all test rows
  const all = await repo.find();

  return NextResponse.json(all);
} 