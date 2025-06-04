import { AppDataSource } from "@/lib/database/typeorm";
import { CustomerEntity } from "@/lib/database/entities";

export async function getAllCustomers({ page = 1, limit = 20, sortBy = "name", sortOrder = "asc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  const qb = repo.createQueryBuilder("customer");

  // Filtering
  if (filters.status) qb.andWhere("customer.status = :status", { status: filters.status });
  if (filters.name) qb.andWhere("customer.name ILIKE :name", { name: `%${filters.name}%` });

  // Sorting
  qb.orderBy(`customer.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getCustomerById(id: string) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  const result = await repo.findOneBy({ id });
  return result || undefined;
}

export async function createCustomer(data: Partial<CustomerEntity>) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  const customer = repo.create(data);
  return repo.save(customer);
}

export async function updateCustomer(id: string, data: Partial<CustomerEntity>) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  await repo.update(id, data);
  return repo.findOneBy({ id });
}

export async function deleteCustomer(id: string) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  return repo.delete(id);
} 