import { AttendanceShift, AttendanceStatus, AttendanceSubStatus } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { Employee as IEmployee } from "./employee";

export interface AttendanceRecord extends IBase{
  number?: string;
  date?: Date;
  checkIn?: Date;
  checkOut?: Date;
  shift?: AttendanceShift;
  status?: AttendanceStatus;
  subStatus?: AttendanceSubStatus;
  notes?: string;
  workHours?: number;
  paidAmount?: number;

  employee?: IEmployee;
}

export interface AttendanceFilters extends IBaseFilters{
  date?: string
  dateFrom?: string
  dateTo?: string
  status?: AttendanceStatus
  shift?: AttendanceShift
  employeeId?: string
  searchTerm?: string
}

export interface TimesheetData {
  employeeId: string
  employeeName: string
  shifts: {
    morning: { [day: string]: AttendanceRecord | null }
    afternoon: { [day: string]: AttendanceRecord | null }
    evening: { [day: string]: AttendanceRecord | null }
    all: { [day: string]: AttendanceRecord | null }
  }
  totalDays: number
}

export type AttendanceViewMode = "list" | "timesheet"
