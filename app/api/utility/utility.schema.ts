import { z } from "zod";
import { UtilityStatus, UtilityType, UtilityUnit } from "@/types/enums";

export const UtilitySchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(UtilityType).optional(),
  name: z.string().optional(),
  provider: z.string().optional(),
  accountNumber: z.string().optional(),
  location: z.string().optional(),
  monthlyUsage: z.number().optional(),
  unit: z.nativeEnum(UtilityUnit).optional(),
  costPerUnit: z.number().optional(),
  monthlyCost: z.number().optional(),
  lastReading: z.string().optional(),
  status: z.nativeEnum(UtilityStatus).optional(),
  dueDate: z.string().optional(),
  description: z.string().optional(),
});
