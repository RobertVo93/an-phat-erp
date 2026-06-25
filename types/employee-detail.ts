import type { AttendanceRecord } from "@/types/attendance"
import type { Employee } from "@/types/employee"
import type { ProductionRecord } from "@/types/production"

export interface IEmployeeDetailAttendance
  extends Omit<AttendanceRecord, "createdAt" | "updatedAt" | "date" | "checkIn" | "checkOut" | "employee"> {
  createdAt?: string
  updatedAt?: string
  date?: string
  checkIn?: string
  checkOut?: string
}

export interface IEmployeeDetailProduction
  extends Omit<ProductionRecord, "createdAt" | "updatedAt" | "date" | "pic" | "product" | "warehouse"> {
  createdAt?: string
  updatedAt?: string
  date?: string
  product?: {
    id?: string
    number?: string
    name?: string
  }
  warehouse?: {
    id?: string
    number?: string
    name?: string
  }
}

export interface IEmployeeDetail
  extends Omit<Employee, "createdAt" | "updatedAt" | "hireDate" | "attendanceRecords" | "productionRecords"> {
  id: string
  createdAt?: string
  updatedAt?: string
  hireDate?: string
  attendanceRecords: IEmployeeDetailAttendance[]
  productionRecords: IEmployeeDetailProduction[]
}

export interface IEmployeeDetailPageData {
  employee: IEmployeeDetail | null
}
