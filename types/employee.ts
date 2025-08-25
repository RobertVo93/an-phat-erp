import { EmployeeType, EmployeeStatus } from "@/types/enums";
import { IBase, IBaseFilters } from "@/types/base.interface";
import { AttendanceRecord as IAttendanceRecord } from "@/types/attendance";
import { ProductionRecord as IProductionRecord } from "@/types/production";

export interface Employee extends IBase {
  number?: string
  name?: string
  email?: string
  phone?: string
  position?: string
  department?: string
  salary?: number
  hireDate?: Date
  employeeType?: EmployeeType
  status?: EmployeeStatus
  address?: string
  emergencyContact?: string
  notes?: string

  attendanceRecords?: IAttendanceRecord[];
  productionRecords?: IProductionRecord[];
}

export interface EmployeeFilters extends IBaseFilters {
  name?: string
  status?: string
  employeeType?: string
  department?: string
  position?: string
  hireDateFrom?: string
  hireDateTo?: string
  salaryMin?: number
  salaryMax?: number
}

export interface EmployeeStats {
  totalEmployees: number
  activeEmployees: number
  departments: number
  onLeave: number
}
