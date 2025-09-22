"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Calendar } from "lucide-react"
import type { TimesheetData } from "@/types/attendance"
import { AttendanceShift } from "@/types"
import { TimesheetShift } from "@/components/attendance/TimesheetShift"
import { AttendanceRecord } from "@/types/attendance"

interface TimesheetViewProps {
  timesheetData: TimesheetData[]
  currentMonth: number
  currentYear: number
  onCellClick: (record: AttendanceRecord | null, employeeData: TimesheetData, shift: AttendanceShift, day: number) => void
}

export function TimesheetView({
  timesheetData,
  currentMonth,
  currentYear,
  onCellClick,
}: TimesheetViewProps) {
  const { t } = useLanguage()
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("attendance.timesheet.title")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div
              className="grid gap-1 mb-2"
              style={{ gridTemplateColumns: `120px 80px repeat(${days.length}, 30px) 60px` }}
            >
              <div className="bg-green-600 text-white p-2 text-xs font-bold text-center rounded">
                {t("attendance.timesheet.employee")}
              </div>
              <div className="bg-green-600 text-white p-2 text-xs font-bold text-center rounded">
                {t("attendance.timesheet.shift")}
              </div>
              {days.map((day) => (
                <div key={day} className="bg-green-600 text-white p-2 text-xs font-bold text-center rounded">
                  {day}
                </div>
              ))}
              <div className="bg-green-600 text-white p-2 text-xs font-bold text-center rounded">
                {t("attendance.timesheet.total")}
              </div>
            </div>

            {/* Employee rows */}
            {timesheetData.map((employeeData) => (
              <div key={employeeData.employeeId} className="mb-4">
                {/* Morning shift */}
                <TimesheetShift
                  employeeData={employeeData}
                  days={days}
                  shift={AttendanceShift.morning}
                  onCellClick={(record, emp, shift, day) => onCellClick(record, emp, shift, day)}
                />
                {/* Afternoon shift */}
                <TimesheetShift
                  employeeData={employeeData}
                  days={days}
                  shift={AttendanceShift.afternoon}
                  onCellClick={(record, emp, shift, day) => onCellClick(record, emp, shift, day)}
                />
                {/* Evening shift */}
                <TimesheetShift
                  employeeData={employeeData}
                  days={days}
                  shift={AttendanceShift.evening}
                  onCellClick={(record, emp, shift, day) => onCellClick(record, emp, shift, day)}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
