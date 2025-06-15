import { StockChangeStatus, StockChangeType } from '@/types';
import { z } from "zod";
import { CreateWarehouseSchema } from '../warehouse/warehouse.schema';
import { ExtendedProductSchema } from '../products/product.schema';

export const WarehouseSchema = CreateWarehouseSchema.extend({
  id: z.string()
});

export const StockProductSchema = z.object({
  quantity: z.number(),
  unitCost: z.number(),
  totalCost: z.number(),
  product: ExtendedProductSchema.optional()
});

export const StockProductArraySchema = z.array(StockProductSchema);

export const CreateStockChangeSchema = z.object({
  receiptNumber: z.string().optional(),
  type: z.nativeEnum(StockChangeType).optional(),
  date: z.coerce.date().optional(),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  discount: z.number().optional(),
  totalAmount: z.number().optional(),
  status: z.nativeEnum(StockChangeStatus).optional(),
  notes: z.string().optional(),
  receivedBy: z.string().optional(),
  receivedDate: z.coerce.date().optional(),
  referenceNumber: z.string().optional(),
  supplier: z.string().optional(),
  warehouse: WarehouseSchema.optional(),
});

export const UpdateStockChangeSchema = CreateStockChangeSchema.partial();

