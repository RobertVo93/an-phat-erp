import { AttendanceShift, AttendanceStatus } from "@/types/enums";
import { IBase } from "./base.interface";
import { Employee as IEmployee } from "./employee";

export interface AttendanceRecord extends IBase{
  date?: string;
  checkIn?: Date;
  checkOut?: Date;
  shift?: AttendanceShift;
  status?: AttendanceStatus;
  workHours?: number;
  overtimeHours?: number;
  dailyWage?: number;
  notes?: string;

  employee?: IEmployee;
}

export interface AttendanceFilters {
  employeeName?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  shift?: string
  employeeId?: string
}

export interface AttendanceStats {
  totalPresent: number
  totalAbsent: number
  totalLate: number
  totalOvertimeHours: number
  totalWages: number
}

export interface TimesheetData {
  employeeId: string
  employeeName: string
  shifts: {
    Morning: { [day: string]: AttendanceRecord | null }
    Afternoon: { [day: string]: AttendanceRecord | null }
    Evening: { [day: string]: AttendanceRecord | null }
  }
  totalDays: number
}
