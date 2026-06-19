import { AppDataSource } from "@/lib/database/typeorm";
import { CustomerEntity } from "@/lib/database/entities/customer.entity";
import { UserEntity } from "@/lib/database/entities/user.entity";
import { v4 as uuidv4 } from 'uuid';
import { CommonService } from "./commonService";
import { UserRole } from "@/types";
import { formatYYYYMMDD } from "../utils.date";

export async function getAllCustomers({ page = 1, limit = 20, sortBy = "name", sortOrder = "asc", filters = {} as Record<string, any> }) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  const qb = repo.createQueryBuilder("customer");
  const normalizedSortOrder = sortOrder.toUpperCase() as "ASC" | "DESC";

  // Join orders
  qb.leftJoinAndSelect("customer.orders", "order");

  // Filtering
  if (filters.status) qb.andWhere("customer.status = :status", { status: filters.status });
  if (filters.customerType) qb.andWhere("customer.customerType = :customerType", { customerType: filters.customerType });
  if (filters.searchTerm) qb.andWhere("(customer.number ILIKE :searchTerm OR customer.name ILIKE :searchTerm OR customer.company ILIKE :searchTerm OR customer.email ILIKE :searchTerm OR customer.phone ILIKE :searchTerm)", { searchTerm: `%${filters.searchTerm}%` });

  // Sorting
  const allowedCustomerSortFields = ["joinDate", "name", "lastOrder", "createdAt"];
  const sortField = allowedCustomerSortFields.includes(sortBy) ? sortBy : "createdAt";
  qb.orderBy(`customer.${sortField}`, normalizedSortOrder);

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
  return await AppDataSource.transaction(async (manager) => {
    const commonService = new CommonService();
    const customerRepo = manager.getRepository(CustomerEntity);
    const userRepo = manager.getRepository(UserEntity);

    const number = await commonService.getEntityNumber(CustomerEntity, "CUS");
    const customerId = uuidv4();

    // Hash the password for the new user
    const password = formatYYYYMMDD(new Date());
    const salt = await (await import('bcryptjs')).genSalt(10);
    const hashedPassword = await (await import('bcryptjs')).hash(password, salt);

    // Create user account
    const user = userRepo.create({
      id: customerId,
      fullName: data.name,
      email: data.email,
      username: number,
      phone: data.phone,
      password: hashedPassword,
      passwordSalt: salt,
      role: UserRole.customer,
      active: true,
      lastLogin: new Date(),
    });
    await userRepo.save(user);

    // Create customer record
    const customer = customerRepo.create({
      ...formatCustomerData(data),
      id: customerId,
      number: number,
      user: user,
    });
    return await customerRepo.save(customer);
  });
}

export async function updateCustomer(id: string, data: Partial<CustomerEntity>) {
  const repo = AppDataSource.getRepository(CustomerEntity);
  await repo.update(id, formatCustomerData(data));
  return repo.findOneBy({ id });
}

export async function deleteCustomer(id: string) {
  return await AppDataSource.transaction(async (manager) => {
    const customerRepo = manager.getRepository(CustomerEntity);
    const userRepo = manager.getRepository(UserEntity);

    // Check if customer exists
    const customer = await customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new Error("Customer not found");
    }

    await customerRepo.delete(id);
    await userRepo.delete(id);

    return { success: true, userId: id };
  });
}
