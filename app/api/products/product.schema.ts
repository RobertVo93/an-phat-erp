import { ProductStatus } from "@/types/enums";
import { z } from "zod";

export const CreateProductSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().optional(),
    cost: z.number().optional(),
    stock: z.number().optional(),
    minStock: z.number().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    supplier: z.string().optional(),
    image: z.string().optional(),
});

export const UpdateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    cost: z.number().optional(),
    stock: z.number().optional(),
    minStock: z.number().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    supplier: z.string().optional(),
    image: z.string().optional(),
});