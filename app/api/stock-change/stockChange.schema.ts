import { StockChangeStatus, StockChangeType } from '@/types';
import { z } from "zod";
import { CreateWarehouseSchema } from '../warehouse/warehouse.schema';

export const WarehouseSchema = CreateWarehouseSchema.extend({
  id: z.string()
});

export const StockProductSchema = z.object({
  id: z.string().optional(),
  unitCost: z.number().optional(),
  quantity: z.number().optional(),
  totalCost: z.number().optional(),
  name: z.string().optional(),
  unit: z.string().optional(),
  sku: z.string().optional(),
});

export const StockProductArraySchema = z.array(StockProductSchema);

export const CreateStockChangeSchema = z.object({
  number: z.string().optional(),
  type: z.nativeEnum(StockChangeType).optional(),
  date: z.coerce.date().optional(),
  supplier: z.string().optional(),
  warehouse: WarehouseSchema.optional(),
  status: z.nativeEnum(StockChangeStatus).optional(),
  stockProducts: StockProductArraySchema.optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  discount: z.number().optional(),
  totalAmount: z.number().optional(),
  notes: z.string().optional(),
  receivedBy: z.string().optional(),
  receivedDate: z.coerce.date().optional(),
});

export const UpdateStockChangeSchema = CreateStockChangeSchema.partial();

