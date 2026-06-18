import { AppDataSource } from "@/lib/database/typeorm";
import { EmployeeEntity } from "../database/entities/employee.entity";

export async function getEmployeeByFilter({ page = 1, limit = 20, sortBy = "createdAt", sortOrder = "asc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(EmployeeEntity);
  const qb = repo.createQueryBuilder("record");

  // Filtering
  if (filters.name) qb.andWhere("record.name ILIKE :name", { name: `%${filters.name}%` });
  if (filters.status) qb.andWhere("record.status = :status", { status: filters.status });
  if (filters.employeeType) qb.andWhere("record.employeeType = :employeeType", { employeeType: filters.employeeType });
  if (filters.department) qb.andWhere("record.department = :department", { department: filters.department });
  if (filters.position) qb.andWhere("record.position = :position", { position: filters.position });
  if (filters.hireDateFrom) qb.andWhere("record.hireDate >= :hireDateFrom", { hireDateFrom: filters.hireDateFrom });
  if (filters.hireDateTo) qb.andWhere("record.hireDate <= :hireDateTo", { hireDateTo: filters.hireDateTo });
  if (filters.salaryMin) qb.andWhere("record.salary >= :salaryMin", { salaryMin: filters.salaryMin });
  if (filters.salaryMax) qb.andWhere("record.salary <= :salaryMax", { salaryMax: filters.salaryMax });

  // Sorting
  qb.orderBy(`record.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
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
