import { ProductStatus, ProductUnit } from "@/types/enums";
import { z } from "zod";
import { CollectionSchema } from "../collections/collection.schema";

export const CreateProductSchema = z.object({
    name: z.string(),
    unit: z.nativeEnum(ProductUnit).optional(),
    description: z.string().optional(),
    collections: z.array(CollectionSchema).optional(),
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
    unit: z.nativeEnum(ProductUnit).optional(),
    description: z.string().optional(),
    collections: z.array(CollectionSchema).optional(),
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

export const ExtendedProductSchema = CreateProductSchema.extend({
  id: z.string().optional(),
});