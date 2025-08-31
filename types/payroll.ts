import { PayrollStatus } from "@/types/enums";
import { IBase, IBaseFilters } from "@/types/base.interface";
import { AttendanceRecord, Employee } from "@/types";

export interface PayrollRecord extends IBase{
  number?: string,
  baseSalary?: number,
  bonus?: number,
  deductions?: number,
  totalSalary?: number, // baseSalary + bonus - deductions
  workingShifts?: number, // = attendance records
  workingHours?: number, // = attendance records * workingHours
  payPeriod?: string, // YYYY-MM
  status?: PayrollStatus,
  paidAt?: Date,
  notes?: string,

  employee?: Employee,
  attendanceRecords?: AttendanceRecord[], // omit this one from query, only for history check
}

export type PayrollSortableKey = "employee.name" | "payPeriod" | "workingShifts" | "workingHours" | "totalSalary" | "status";

export interface PayrollFilters extends IBaseFilters{
  status?: string
  payPeriod?: string
  salaryMin?: number
  salaryMax?: number
  searchTerm?: string
}

export interface PayrollStats {
  totalPayroll: number
  processedCount: number
  pendingCount: number
  averageSalary: number
}