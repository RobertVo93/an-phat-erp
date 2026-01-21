import { AppDataSource } from "@/lib/database/typeorm";
import { CustomerEntity } from "@/lib/database/entities";

export async function getAllCustomers({ page = 1, limit = 20, sortBy = "name", sortOrder = "asc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  const qb = repo.createQueryBuilder("customer");

  // Join orders
  qb.leftJoinAndSelect("customer.orders", "order");

  // Filtering
  if (filters.status) qb.andWhere("customer.status = :status", { status: filters.status });
  if (filters.customerType) qb.andWhere("customer.customerType = :customerType", { customerType: filters.customerType });
  if (filters.searchTerm) qb.andWhere("(customer.number ILIKE :searchTerm OR customer.name ILIKE :searchTerm OR customer.company ILIKE :searchTerm OR customer.email ILIKE :searchTerm OR customer.phone ILIKE :searchTerm)", { searchTerm: `%${filters.searchTerm}%` });

  // Sorting
  qb.orderBy(`customer.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");

  // Pagination
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function getCustomerById(id: string) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  const result = await repo.findOne({
    where: { id },
    relations: {
      addresses: true,
    },
  });
  return result || undefined;
}

const formatCustomerData = (data: Partial<CustomerEntity>) => {
  const formattedData = {
    ...data,
    joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
    lastOrder: data.lastOrder ? new Date(data.lastOrder) : undefined,
  }
  return formattedData
}

export async function createCustomer(data: Partial<CustomerEntity>) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  const customer = repo.create(formatCustomerData(data));
  return repo.save(customer);
}

export async function updateCustomer(id: string, data: Partial<CustomerEntity>) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  await repo.update(id, formatCustomerData(data));
  return repo.findOneBy({ id });
}

export async function deleteCustomer(id: string) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  return repo.delete(id);
} 