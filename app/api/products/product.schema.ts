import { ProductStatus, ProductUnit } from "@/types/enums";
import { z } from "zod";
import { CollectionSchema } from "../collections/collection.schema";

const productTierPriceSchema = z.object({
    minQuantity: z.number().int().min(1),
    maxQuantity: z.number().int().min(1).optional(),
    price: z.number().min(0),
    order: z.number().int().min(1),
}).refine((tier) => tier.maxQuantity === undefined || tier.maxQuantity > tier.minQuantity, {
    message: "maxQuantity must be greater than minQuantity",
    path: ["maxQuantity"],
});

export const ProductTierPricesSchema = z.array(productTierPriceSchema).superRefine((tiers, ctx) => {
    for (let index = 0; index < tiers.length; index += 1) {
        const tier = tiers[index];
        const previousTier = tiers[index - 1];

        if (tier.order !== index + 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "tier price order must match its position",
                path: [index, "order"],
            });
        }

        if (index === 0 && tier.minQuantity !== 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "first tier price minQuantity must be 1",
                path: [index, "minQuantity"],
            });
        }

        if (index > 0) {
            if (previousTier.maxQuantity === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "only the last tier price can have empty maxQuantity",
                    path: [index - 1, "maxQuantity"],
                });
            } else if (tier.minQuantity !== previousTier.maxQuantity + 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "tier price minQuantity must follow previous maxQuantity",
                    path: [index, "minQuantity"],
                });
            }
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
