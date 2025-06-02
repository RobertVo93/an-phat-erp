import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database/typeorm";
import { Collection } from "@/lib/database/entities/Collection";

export async function GET() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();

  // Create a new test row
  const repo = AppDataSource.getRepository(Collection);
  const test = repo.create({ 
    name: "Hello Neon!",
    description: "Hello Neon!",
    productCount: 100,
    status: "Active",
    createdDate: new Date().toISOString().slice(0, 10),
    totalValue: "100",
    category: "Fashion"
   });
  await repo.save(test);

  // Fetch all test rows
  const all = await repo.find();

  return NextResponse.json(all);
} 