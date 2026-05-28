import { z } from "zod";
import { AttendanceShift, AttendanceStatus, AttendanceSubStatus } from "@/types/enums";
import { EmployeeSchema } from "../employee/employee.schema";

export const AttendanceSchema = z.object({
  date: z.coerce.date().optional(),
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
  subStatus: z.nativeEnum(AttendanceSubStatus).nullable().optional(),
  workHours: z.number().optional(),
  paidAmount: z.number().optional(),
  notes: z.string().optional(),

  employee: EmployeeSchema.optional(),
});