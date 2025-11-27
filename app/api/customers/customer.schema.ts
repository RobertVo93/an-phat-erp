import { z } from "zod";
import { CustomerStatus, CustomerType } from "@/types/enums";

export const CreateCustomerSchema = z.object({
    name: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    lastOrder: z.string().optional(),
    status: z.nativeEnum(CustomerStatus).optional(),
    customerType: z.nativeEnum(CustomerType).optional(),
    joinDate: z.string().optional(),
    notes: z.string().optional(),
});

export const UpdateCustomerSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    location: z.string().nullable().optional(),
    lastOrder: z.string().nullable().optional(),
    status: z.nativeEnum(CustomerStatus).optional(),
    customerType: z.nativeEnum(CustomerType).optional(),
    joinDate: z.string().optional(),
    notes: z.string().optional(),
});

export const CustomerSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional(),
    location: z.string().optional(),
    status: z.nativeEnum(CustomerStatus).optional(),
    customerType: z.nativeEnum(CustomerType).optional(),
    joinDate: z.string().optional(),
    notes: z.string().optional(),
});