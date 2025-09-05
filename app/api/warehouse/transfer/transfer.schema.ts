import { z } from "zod";

export const TransferSchema = z.object({
  sourceWarehouseId: z.string().uuid(),
  destinationWarehouseId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().positive(),
});