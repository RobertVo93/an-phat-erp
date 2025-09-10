import { z } from "zod";
import { OrderStatus, PaymentStatus, PaymentMethod, ProductUnit } from "@/types/enums";

export const RelationIdSchema = z.object({
  id: z.string().optional(),
});

export const OrderItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  quantity: z.number().optional(),
  totalCost: z.number().optional(),
  unitCost: z.number().optional(),
  unit: z.nativeEnum(ProductUnit).optional(),
  number: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  deliveryDate: z.coerce.date().optional(),
  totalAmount: z.number().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  tax: z.number().optional(),
  shippingFee: z.number().optional(),

  items: z.array(OrderItemSchema).optional(),
  customer: RelationIdSchema.optional(),
  warehouse: RelationIdSchema.optional(),
});

export const UpdateOrderSchema = CreateOrderSchema.partial(); 