import { AppDataSource } from "@/lib/database/typeorm";
import { InvoiceEntity, UtilityReading } from "../database/entities";
import type { UtilityReading as IUtilityReading, Invoice as IInvoice } from "@/types"

export async function getAllInvoices() {
  const repo = AppDataSource.getRepository(InvoiceEntity);

  const invoices = await repo.find({
    relations: ["readings"],
    order: { createdAt: "DESC" },
  });

  return { data: invoices as IInvoice[] };
}

export async function addInvoice(invoiceData: IInvoice, readings: IUtilityReading[]) {
  const invoiceRepo = AppDataSource.getRepository(InvoiceEntity);
  const readingRepo = AppDataSource.getRepository(UtilityReading);

  // STEP1: create invoice
  const invoice = invoiceRepo.create(invoiceData);
  await invoiceRepo.save(invoice);

  // STEP2: create utility readings
  const readingEntities = readings.map((r) => {
    return readingRepo.create({
      ...r,
      invoice: invoice,
    });
  });
  await readingRepo.save(readingEntities);

  return invoice
}

export async function updateInvoice(id: string, invoiceData: IInvoice, readings: IUtilityReading[]) {
  const invoiceRepo = AppDataSource.getRepository(InvoiceEntity);
  const readingRepo = AppDataSource.getRepository(UtilityReading);

  const existingInvoice = await invoiceRepo.findOne({ where: { id } });
  if (!existingInvoice) {
    throw new Error("Invoice not found.");
  }

  // STEP 1: remove old utility readings
  await readingRepo.delete({ invoice: { id } });

  // STEP 2: update invoice
  const { readings: _, ...safeInvoiceData } = invoiceData;
  await invoiceRepo.update(id, safeInvoiceData);

  // STEP 5: create new utility readings
  const readingEntities = readings.map((r) =>
    readingRepo.create({
      ...r,
      invoice: existingInvoice,
    })
  );
  await readingRepo.save(readingEntities);

  const updatedInvoice = await invoiceRepo.findOne({
    where: { id },
    relations: ["readings"],
  });

  return updatedInvoice!;
}

export async function deleteInvoice(id: string) {
  const invoiceRepo = AppDataSource.getRepository(InvoiceEntity);
  const readingRepo = AppDataSource.getRepository(UtilityReading);

  const invoice = await invoiceRepo.findOne({ where: { id } });
  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  await readingRepo.delete({ invoice: { id } });

  await invoiceRepo.delete(id);

  return { message: "Invoice deleted successfully." };
}
