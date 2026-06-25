import { AppDataSource } from "@/lib/database/typeorm";
import { EmployeeEntity } from "../database/entities/employee.entity";
import { endOfDay, startOfDay } from "date-fns";
import type { EmployeeSortBy } from "@/types/employee";
import { AttendanceRecordEntity } from "@/lib/database/entities/attendance-record.entity";
import { ProductionRecordEntity } from "@/lib/database/entities/production-record.entity";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMPLOYEE_SORT_FIELDS: EmployeeSortBy[] = [
  "createdAt",
  "name",
  "position",
  "department",
  "salary",
  "status",
  "employeeType",
];

interface IGetEmployeeByFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  filters?: Record<string, unknown>;
}

export async function getEmployeeByFilter({
  page = 1,
  limit = 20,
  sortBy = "createdAt",
  sortOrder = "desc",
  filters = {},
}: IGetEmployeeByFilterParams) {
  const repo = AppDataSource.getRepository(EmployeeEntity);
  const qb = repo.createQueryBuilder("record");

  // Filtering
  if (filters.name) qb.andWhere("record.name ILIKE :name", { name: `%${filters.name}%` });
  if (filters.status) qb.andWhere("record.status = :status", { status: filters.status });
  if (filters.employeeType) qb.andWhere("record.employeeType = :employeeType", { employeeType: filters.employeeType });
  if (filters.department) {
    qb.andWhere("LOWER(record.department) = LOWER(:department)", { department: filters.department });
  }
  if (filters.position) qb.andWhere("record.position ILIKE :position", { position: `%${filters.position}%` });
  if (filters.hireDateFrom) {
    qb.andWhere("record.hireDate >= :hireDateFrom", { hireDateFrom: startOfDay(String(filters.hireDateFrom)) });
  }
  if (filters.hireDateTo) {
    qb.andWhere("record.hireDate <= :hireDateTo", { hireDateTo: endOfDay(String(filters.hireDateTo)) });
  }
  if (filters.salaryMin !== undefined) qb.andWhere("record.salary >= :salaryMin", { salaryMin: filters.salaryMin });
  if (filters.salaryMax !== undefined) qb.andWhere("record.salary <= :salaryMax", { salaryMax: filters.salaryMax });

  // Sorting
  const safeSortBy = EMPLOYEE_SORT_FIELDS.includes(sortBy as EmployeeSortBy) ? sortBy : "createdAt";
  const safeSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
  qb.orderBy(`record.${safeSortBy}`, safeSortOrder);

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getEmployeeByIdOrNumber(idOrNumber: string) {
  const repo = AppDataSource.getRepository(EmployeeEntity);
  const attendanceRepo = AppDataSource.getRepository(AttendanceRecordEntity);
  const productionRepo = AppDataSource.getRepository(ProductionRecordEntity);
  const where = UUID_PATTERN.test(idOrNumber)
    ? [{ id: idOrNumber }, { number: idOrNumber }]
    : [{ number: idOrNumber }];

  const employee = await repo.findOne({ where });
  if (!employee?.id) return null;

  const [attendanceRecords, productionRecords] = await Promise.all([
    attendanceRepo.find({
      where: { employee: { id: employee.id } },
      order: { date: "DESC" },
      take: 5,
    }),
    productionRepo.find({
      where: { pic: { id: employee.id } },
      relations: {
        product: true,
        warehouse: true,
      },
      order: { date: "DESC" },
      take: 5,
    }),
  ]);

  employee.attendanceRecords = attendanceRecords;
  employee.productionRecords = productionRecords;
  return employee;
}

export async function getEmployee() {
  const repo = AppDataSource.getRepository(EmployeeEntity);
  const qb = repo.createQueryBuilder("employee");
  const [ data ] = await qb.getManyAndCount();
  return { data };
}

export async function addEmployee(data: Partial<EmployeeEntity>) {
  const repo = AppDataSource.getRepository(EmployeeEntity);
  const employee = repo.create(data);
  return repo.save(employee);
}

export async function updateEmployee(id: string, data: Partial<EmployeeEntity>) {
  const repo = AppDataSource.getRepository(EmployeeEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteEmployee(id: string) {
  const repo = AppDataSource.getRepository(EmployeeEntity);
  return repo.delete(id);
} 
