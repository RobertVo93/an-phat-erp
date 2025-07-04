import { z } from "zod";
import { AttendanceShift, AttendanceStatus } from "@/types/enums";
import { EmployeeSchema } from "../employee/employee.schema";

export const AttendanceSchema = z.object({
  date: z.string().optional(),
  checkIn: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date) ? new Date(val) : undefined,
    z.date().optional()
  ),
  checkOut: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date) ? new Date(val) : undefined,
    z.date().optional()
  ),
  shift: z.nativeEnum(AttendanceShift).optional(),
  status: z.nativeEnum(AttendanceStatus).optional(),
  workHours: z.number().optional(),
  overtimeHours: z.number().optional(),
  dailyWage: z.number().optional(),
  notes: z.string().optional(),

  employee: EmployeeSchema.optional(),
});