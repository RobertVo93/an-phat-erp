import { InvoiceStatus, UtilityUnit } from "@/types";
import { z } from "zod";

export const InvoiceUtilitySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  quantity: z.number().optional(),
  totalCost: z.number().optional(),
  unitCost: z.number().optional(),
  unit: z.nativeEnum(UtilityUnit).optional(),
  number: z.string().optional(),
});

export const InvoiceSchema = z.object({
  billingPeriod: z.string().optional(),
  issueDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  subtotal: z.number().optional(),
  taxRate: z.number().optional(),
  taxAmount: z.number().optional(),
  otherFees: z.number().optional(),
  otherFeesDescription: z.string().optional(),
  total: z.number().optional(),
  status: z.nativeEnum(InvoiceStatus).optional(),
  notes: z.string().optional(),
  utilities: z.array(InvoiceUtilitySchema).optional(),
});

export const UpdateInvoiceSchema = InvoiceSchema.partial();