import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { EmployeeSchema } from "./employee.schema";
import { addEmployee, getEmployeeByFilter } from "@/lib/services/employeeService";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const status = searchParams.get("status") || undefined;
    const name = searchParams.get("name") || undefined;
    const employeeType = searchParams.get("employeeType") || undefined;
    const department = searchParams.get("department") || undefined;
    const position = searchParams.get("position") || undefined;
    const hireDateFrom = searchParams.get("hireDateFrom") || undefined;
    const hireDateTo = searchParams.get("hireDateTo") || undefined;
    const salaryMin = searchParams.get("salaryMin") || undefined;
    const salaryMax = searchParams.get("salaryMax") || undefined;

    const result = await getEmployeeByFilter({
      page,
      limit,
      sortBy,
      sortOrder,
      filters: { status, name, employeeType, department, position, hireDateFrom, hireDateTo, salaryMin, salaryMax },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const data = await req.json();
    const parse = EmployeeSchema.safeParse(data);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    const created = await addEmployee(parse.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}