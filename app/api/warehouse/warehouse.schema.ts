import { WarehouseStatus, WarehouseTemperature, WarehouseType } from "@/types";
import { z } from "zod";

export const CreateWarehouseSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  address: z.string().optional(),
  manager: z.string().optional(),
  capacity: z.number().optional(),
  occupied: z.number().optional(),
  status: z.nativeEnum(WarehouseStatus).optional(),
  type: z.nativeEnum(WarehouseType).optional(),
  zones: z.number().optional(),
  temperature: z.nativeEnum(WarehouseTemperature).optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  description: z.string().optional(),
});

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial(); 