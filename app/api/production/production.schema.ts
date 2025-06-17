import { ProductionStatus } from '@/types';
import { z } from "zod";
import { ExtendedProductSchema } from '../products/product.schema';

export const ProductionMaterialSchema = z.object({
  id: z.string().optional(),
  material: ExtendedProductSchema.optional(),
  quantity: z.number().optional(),
  totalCost: z.number().optional(),
});

export const ProductionMaterialArraySchema = z.array(ProductionMaterialSchema);

export const ProductionSchema = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  quantity: z.number().optional(),
  unit: z.string().optional(),
  status: z.nativeEnum(ProductionStatus).optional(),
  statusText: z.string().optional(),
  shift: z.string().optional(),
  operator: z.string().optional(),

  product: ExtendedProductSchema.optional(),
  productionMaterials: z.array(ProductionMaterialSchema).optional(),

  utilities: z.array(z.object({
    name: z.string().optional(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    cost: z.number().optional(),
  })).optional(),

  labor: z.object({
    hours: z.number().optional(),
    workers: z.number().optional(),
    cost: z.number().optional(),
  }).optional(),

  totalCost: z.number().optional(),
  efficiency: z.number().optional()
});

