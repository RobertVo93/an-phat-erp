import { NextRequest, NextResponse } from "next/server";
import { ensureDataSource } from "@/lib/database/ensureDataSource";
import { getUserFromRequest } from "@/lib/auth/jwt";
import { EmployeeSchema } from "../employee.schema";
import { deleteEmployee, getEmployeeByIdOrNumber, updateEmployee } from "@/lib/services/employeeService";

interface IEmployeeRouteContext {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: IEmployeeRouteContext) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureDataSource();
    const { id } = await params;
    const employee = await getEmployeeByIdOrNumber(decodeURIComponent(id));
    if (!employee) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(employee);
  } catch (error) {
    console.error("[api/employee/[id]] Failed to load employee", { error });
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: IEmployeeRouteContext
) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { id } = await params;
    const data = await req.json();
    const parsedInput = {
      ...data,
      salary: Number(data.salary),
      hireDate: new Date(data.hireDate),
    };
    const parse = EmployeeSchema.safeParse(parsedInput);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid input", details: parse.error.errors }, { status: 400 });
    }
    const updated = await updateEmployee(id, parse.data);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[api/employee/[id]] Failed to update employee", { error });
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: IEmployeeRouteContext
) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await ensureDataSource();
    const { id } = await params;
    const result = await deleteEmployee(id);
    if (result.affected === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[api/employee/[id]] Failed to delete employee", { error });
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
