import { z } from "zod";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@/types/enums";

export const CreateOrderSchema = z.object({
  deliveryDate: z.string().optional(), // ISO string
  totalAmount: z.number().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  customer: z.string().optional(), // required customer ID
  items: z.array(z.string()).optional(), // required array of OrderItem IDs
  tax: z.number().optional(),
  shippingFee: z.number().optional(),
});

export const UpdateOrderSchema = CreateOrderSchema.partial(); 