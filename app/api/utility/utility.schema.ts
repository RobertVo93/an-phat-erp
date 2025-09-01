import { z } from "zod";
import { UtilityStatus, UtilityUnit } from "@/types/enums";

export const UtilitySchema = z.object({
  name: z.string().optional(),
  provider: z.string().optional(),
  location: z.string().optional(),
  unit: z.nativeEnum(UtilityUnit).optional(),
  costPerUnit: z.number().optional(),
  status: z.nativeEnum(UtilityStatus).optional(),
  description: z.string().optional(),
});

export const UpdateUtilitySchema = UtilitySchema.partial();