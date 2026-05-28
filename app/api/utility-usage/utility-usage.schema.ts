import { z } from "zod";
import { UtilityUnit, UtilityUsageStatus } from "@/types/enums";

export const UtilityUsageSchema = z.object({
  usageTime: z.coerce.date().optional(),
  unit: z.nativeEnum(UtilityUnit).optional(),
  amountBefore: z.number().optional(),
  amountAfter: z.number().optional(),
  totalUsage: z.number().optional(),
  status: z.nativeEnum(UtilityUsageStatus).optional(),
  note: z.string().optional(),
  recorder: z.object({ id: z.string() }).optional(),
  approver: z.object({ id: z.string() }).optional(),
  utility: z.object({ id: z.string() }).optional(),
});

export const UpdateUtilityUsageSchema = UtilityUsageSchema.partial();
