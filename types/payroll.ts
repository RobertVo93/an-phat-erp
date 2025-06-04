import { PayrollStatus } from "@/types/enums";
import { IBase } from "./base.interface";

export interface PayrollRecord extends IBase{
  employeeId?: string
  name?: string
  department?: string
  position?: string
  baseSalary?: number
  overtime?: number
  bonus?: number
  deductions?: number
  netSalary?: number
  status?: PayrollStatus
  payPeriod?: string
  workingDays?: number
  overtimeHours?: number
  notes?: string
  processedDate?: string
}

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
