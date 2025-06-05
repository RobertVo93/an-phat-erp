import { z } from "zod";
import { CollectionCategory, CollectionStatus } from "@/types/enums";

export const CollectionSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    status: z.nativeEnum(CollectionStatus).optional(),
    category: z.nativeEnum(CollectionCategory).optional(),
    image: z.string().optional(),
  });