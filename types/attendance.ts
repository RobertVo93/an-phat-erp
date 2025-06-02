export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn?: string
  checkOut?: string
  shift: "Morning" | "Afternoon" | "Evening"
  status: "Present" | "Absent" | "Late" | "Half Day" | "Overtime"
  workHours: number
  overtimeHours: number
  dailyWage: number
  notes?: string
  createdAt: string
  updatedAt: string
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
