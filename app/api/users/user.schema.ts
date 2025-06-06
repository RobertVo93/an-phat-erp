import { z } from "zod";
import { UserRole } from "@/types/enums";

export const UserSchema = z.object({
    email: z.string().optional(),
    username: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
    active: z.boolean().optional(),
    lastLogin: z.date().optional(),
  });