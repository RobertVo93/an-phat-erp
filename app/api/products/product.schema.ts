import { ProductStatus, ProductUnit } from "@/types/enums";
import { z } from "zod";
import { CollectionSchema } from "../collections/collection.schema";

export const ProductTierPriceSchema = z.object({
    minQuantity: z.number().int().min(1),
    maxQuantity: z.number().int().min(1).optional(),
    price: z.number().min(0),
}).refine((tier) => tier.maxQuantity === undefined || tier.maxQuantity >= tier.minQuantity, {
    message: "maxQuantity must be greater than or equal to minQuantity",
    path: ["maxQuantity"],
});

export const ProductTierPricesSchema = z.array(ProductTierPriceSchema).superRefine((tiers, ctx) => {
    const sortedTiers = tiers.slice().sort((a, b) => a.minQuantity - b.minQuantity);

    for (let index = 1; index < sortedTiers.length; index += 1) {
        const previousTier = sortedTiers[index - 1];
        const currentTier = sortedTiers[index];

        if (previousTier.maxQuantity === undefined || currentTier.minQuantity <= previousTier.maxQuantity) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "tier price ranges must not overlap",
                path: [index, "minQuantity"],
            });
        }
    }
});

export const CreateProductSchema = z.object({
    name: z.string(),
    unit: z.nativeEnum(ProductUnit).optional(),
    description: z.string().optional(),
    collections: z.array(CollectionSchema).optional(),
    price: z.number().optional(),
    tierPrices: ProductTierPricesSchema.optional(),
    cost: z.number().optional(),
    stock: z.number().optional(),
    minStock: z.number().optional(),
    barcode: z.string().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    supplier: z.string().optional(),
    image: z.string().optional(),
    subImages: z.array(z.string()).optional(),
});

export const UpdateProductSchema = z.object({
    name: z.string().optional(),
    unit: z.nativeEnum(ProductUnit).optional(),
    description: z.string().optional(),
    collections: z.array(CollectionSchema).optional(),
    price: z.number().optional(),
    tierPrices: ProductTierPricesSchema.optional(),
    cost: z.number().optional(),
    stock: z.number().optional(),
    minStock: z.number().optional(),
    barcode: z.string().optional(),
    status: z.nativeEnum(ProductStatus).optional(),
    supplier: z.string().optional(),
    image: z.string().optional(),
    subImages: z.array(z.string()).optional(),
});

export const ExtendedProductSchema = CreateProductSchema.extend({
  id: z.string().optional(),
});
