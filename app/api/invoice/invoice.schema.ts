import { InvoiceStatus } from "@/types";
import { z } from "zod";
import { UtilitySchema } from "../utility/utility.schema";

export const UtilityReadingSchema = z.object({
  utilityType: z.string().optional(),
  utilityName: z.string(),
  consumption: z.number(),
  unitPrice: z.number(),
  total: z.number(),

  utility: UtilitySchema.optional(),
});

export const UtilityReadingArraySchema = z.array(UtilityReadingSchema)

export const InvoiceSchema = z.object({
  invoiceNumber: z.string().optional(),
  billingPeriod: z.coerce.date().optional(),
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
  readings: z.array(UtilityReadingSchema).optional(),
});
