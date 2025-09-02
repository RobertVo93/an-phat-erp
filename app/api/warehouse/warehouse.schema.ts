import { WarehouseStatus } from "@/types";
import { z } from "zod";

export const CreateWarehouseSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  manager: z.string().optional(),
  status: z.nativeEnum(WarehouseStatus).optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  description: z.string().optional(),
  main: z.boolean().optional(),
});

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial(); 

export const WarehouseSchema = CreateWarehouseSchema.extend({
  id: z.string()
});