import { EmployeeType, EmployeeStatus } from "@/types/enums";
import { IBase } from "./base.interface";
import { AttendanceRecord as IAttendanceRecord } from "./attendance";

export interface Employee extends IBase{
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
}

export interface EmployeeFilters {
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
