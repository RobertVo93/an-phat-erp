import { z } from "zod";
import { PayrollStatus } from "@/types/enums";
import { EmployeeSchema } from "@/app/api/employee/employee.schema";
import { AttendanceSchema } from "@/app/api/attendance/attendance.schema";

export const CreatePayrollSchema = z.object({
  baseSalary: z.number().optional(),
  bonus: z.number().optional(),
  deductions: z.number().optional(),
  totalSalary: z.number().optional(),
  workingShifts: z.number().optional(),
  workingHours: z.number().optional(),
  payPeriod: z.string().optional(),
  status: z.nativeEnum(PayrollStatus).optional(),
  paidAt: z.coerce.date().optional(),
  notes: z.string().optional(),
  employee: EmployeeSchema.optional(),
  attendanceRecords: z.array(AttendanceSchema).optional(),
});

export const UpdatePayrollSchema = CreatePayrollSchema.partial(); 