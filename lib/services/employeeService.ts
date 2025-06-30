import { AppDataSource } from "@/lib/database/typeorm";
import { EmployeeEntity } from "../database/entities";

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