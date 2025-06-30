import { z } from "zod";
import { EmployeeStatus, EmployeeType } from "@/types/enums";

export const EmployeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  salary: z.number().optional(),
  hireDate: z.date().optional(),
  employeeType: z.nativeEnum(EmployeeType).optional(),
  status: z.nativeEnum(EmployeeStatus).optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});