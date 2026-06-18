import { AppDataSource } from "@/lib/database/typeorm";
import { InvoiceEntity } from "@/lib/database/entities/invoice.entity";
import type { Invoice as IInvoice, InvoiceFilters } from "@/types"

export async function getAllInvoicesService({ page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", filters = {} as InvoiceFilters }) {
  const repo = AppDataSource.getRepository(InvoiceEntity);
  const qb = repo.createQueryBuilder("invoice");

  if (filters.status) qb.andWhere("invoice.status = :status", { status: filters.status });
  if (filters.billingPeriod) qb.andWhere("invoice.billingPeriod = :billingPeriod", { billingPeriod: filters.billingPeriod });
  if (filters.dueDateFrom) qb.andWhere("invoice.dueDate >= :dueDateFrom", { dueDateFrom: filters.dueDateFrom });
  if (filters.dueDateTo) qb.andWhere("invoice.dueDate <= :dueDateTo", { dueDateTo: filters.dueDateTo });
  if (filters.amountFrom) qb.andWhere("invoice.total >= :amountFrom", { amountFrom: filters.amountFrom });
  if (filters.amountTo) qb.andWhere("invoice.total <= :amountTo", { amountTo: filters.amountTo });
  if (filters.searchTerm) qb.andWhere("(invoice.number ILIKE :searchTerm OR invoice.billingPeriod ILIKE :searchTerm OR invoice.notes ILIKE :searchTerm OR invoice.otherFeesDescription ILIKE :searchTerm)", { searchTerm: `%${filters.searchTerm}%` });

  qb.orderBy(`invoice.${sortBy}`, sortOrder.toUpperCase() as "ASC" | "DESC");
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return { data, total, page, limit };
}

export async function addInvoiceService(data: IInvoice) {
  const repo = AppDataSource.getRepository(InvoiceEntity);
  const added = repo.create(data);
  return repo.save(added);
}

export async function updateInvoiceService(
  id: string,
  data: Partial<IInvoice>
) {
  const repo = AppDataSource.getRepository(InvoiceEntity);
  const record = await repo.findOneBy({ id });
  if (!record) throw new Error("Invoice not found");
  repo.merge(record, data);
  return await repo.save(record);
}

export async function deleteInvoiceService(id: string) {
  const repo = AppDataSource.getRepository(InvoiceEntity);
  const record = await repo.findOneBy({ id });
  if (!record) throw new Error("Invoice not found");
  await repo.remove(record);
  return true;
} 
