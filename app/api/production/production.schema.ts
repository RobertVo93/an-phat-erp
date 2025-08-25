import { ProductionElementType, ProductionStatus } from '@/types';
import { z } from "zod";
import { ExtendedProductSchema } from '@/app/api/products/product.schema';
import { EmployeeSchema } from '@/app/api/employee/employee.schema';
import { WarehouseSchema } from '@/app/api/stock-change/stockChange.schema';

export const ProductionElementSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  quantity: z.number().optional(),
  totalCost: z.number().optional(),
  unitCost: z.number().optional(),
  unit: z.string().optional(),
  type: z.nativeEnum(ProductionElementType).optional(),
  number: z.string().optional(),
});

export const ProductionSchema = z.object({
  id: z.string().optional(),
  number: z.string().optional(),
  date: z.coerce.date().optional(),
  quantity: z.number().optional(),
  status: z.nativeEnum(ProductionStatus).optional(),
  totalCost: z.number().optional(),
  totalExpense: z.number().optional(),
  materials: z.array(ProductionElementSchema).optional(),
  utilities: z.array(ProductionElementSchema).optional(),
  labors: z.array(ProductionElementSchema).optional(),

  product: ExtendedProductSchema.optional(),
  warehouse: WarehouseSchema.optional(),
  pic: EmployeeSchema.optional(),
});

