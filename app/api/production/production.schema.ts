import { ProductionStatus } from '@/types';
import { z } from "zod";
import { ExtendedProductSchema } from '../products/product.schema';
import { UtilitySchema } from '../utility/utility.schema';
import { EmployeeSchema } from '../employee/employee.schema';

export const ProductionMaterialSchema = z.object({
  id: z.string().optional(),
  material: ExtendedProductSchema.optional(),
  quantity: z.number().optional(),
  totalCost: z.number().optional(),
});
export const ProductionMaterialArraySchema = z.array(ProductionMaterialSchema);

export const ProductionUtilitySchema = z.object({
  id: z.string().optional(),
  utility: UtilitySchema.optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  cost: z.number().optional(),
});
export const ProductionUtilityArraySchema = z.array(ProductionUtilitySchema);

export const ProductionLaborSchema = z.object({
  id: z.string().optional(),
  employee: EmployeeSchema.optional(),
  hours: z.number().optional(),
  cost: z.number().optional(),
});
export const ProductionLaborArraySchema = z.array(ProductionLaborSchema);

export const ProductionSchema = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  status: z.nativeEnum(ProductionStatus).optional(),
  shift: z.string().optional(),
  operator: z.string().optional(),

  product: ExtendedProductSchema.optional(),
  productionMaterials: z.array(ProductionMaterialSchema).optional(),
  utilities: z.array(ProductionUtilitySchema).optional(),
  labor: z.array(ProductionLaborSchema).optional(),

  totalCost: z.number().optional(),
  efficiency: z.number().optional()
});

