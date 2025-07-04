import { PayrollStatus } from "@/types/enums";
import { IBase } from "./base.interface";
import { Employee } from "./employee";

export interface PayrollRecord extends IBase{
  id?: string,
  bonus?: number,
  deductions?: number,
  workingShifts?: number,
  payPeriod?: string,
  totalSalary?: number,
  status?: PayrollStatus,
  paidAt?: Date,
  notes?: string,

  employee?: Employee,
}

export type SortableKey = "employee.name" | "employee.department" | "totalSalary" | "status";

export interface PayrollFilters {
  status?: string
  department?: string
  position?: string
  payPeriod?: string
  salaryMin?: number
  salaryMax?: number
}

export interface PayrollStats {
  totalPayroll: number
  processedCount: number
  pendingCount: number
  averageSalary: number
}

export interface PayrollCalculation {
  baseSalary: number
  overtimeRate: number
  workingDays: number
  overtimeHours: number
  bonus: number
  taxRate: number
  insuranceRate: number
}
