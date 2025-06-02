"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Save, Calendar } from "lucide-react"
import type { TimesheetData } from "@/types/attendance"

interface TimesheetViewProps {
  timesheetData: TimesheetData[]
  currentMonth: number
  currentYear: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
  onSave: () => void
}

export function TimesheetView({
  timesheetData,
  currentMonth,
  currentYear,
  onMonthChange,
  onYearChange,
  onSave,
}: TimesheetViewProps) {
  const { t } = useLanguage()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ]

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  const getCellContent = (employeeData: TimesheetData, shift: string, day: number) => {
    const record = employeeData.shifts[shift as keyof typeof employeeData.shifts][day.toString()]
    if (record && record.status === "Present") {
      return "x"
    }
    return "-"
  }

  const getCellClass = (employeeData: TimesheetData, shift: string, day: number) => {
    const record = employeeData.shifts[shift as keyof typeof employeeData.shifts][day.toString()]
    if (record && record.status === "Present") {
      return "bg-orange-400 text-white font-bold"
    }
    return "bg-gray-100 text-gray-400"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("attendance.timesheet.title")}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={currentMonth.toString()} onValueChange={(value) => onMonthChange(Number.parseInt(value))}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={currentYear.toString()} onValueChange={(value) => onYearChange(Number.parseInt(value))}>
              <SelectTrigger className="w-full sm:w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-[120px_80px_repeat(31,_30px)_60px] gap-1 mb-2">
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
                <div className="grid grid-cols-[120px_80px_repeat(31,_30px)_60px] gap-1 mb-1">
                  <div className="bg-white border p-2 text-xs font-medium text-center">{employeeData.employeeName}</div>
                  <div className="bg-orange-100 text-orange-800 p-2 text-xs font-medium text-center">
                    {t("attendance.shift.morning")}
                  </div>
                  {days.map((day) => (
                    <div
                      key={`morning-${day}`}
                      className={`p-2 text-xs text-center border ${getCellClass(employeeData, "Morning", day)}`}
                    >
                      {getCellContent(employeeData, "Morning", day)}
                    </div>
                  ))}
                  <div className="bg-white border p-2 text-xs font-bold text-center">
                    {Object.values(employeeData.shifts.Morning).filter((record) => record?.status === "Present").length}
                  </div>
                </div>

                {/* Afternoon shift */}
                <div className="grid grid-cols-[120px_80px_repeat(31,_30px)_60px] gap-1 mb-1">
                  <div className="bg-white border p-2 text-xs"></div>
                  <div className="bg-blue-100 text-blue-800 p-2 text-xs font-medium text-center">
                    {t("attendance.shift.afternoon")}
                  </div>
                  {days.map((day) => (
                    <div
                      key={`afternoon-${day}`}
                      className={`p-2 text-xs text-center border ${getCellClass(employeeData, "Afternoon", day)}`}
                    >
                      {getCellContent(employeeData, "Afternoon", day)}
                    </div>
                  ))}
                  <div className="bg-white border p-2 text-xs font-bold text-center">
                    {
                      Object.values(employeeData.shifts.Afternoon).filter((record) => record?.status === "Present")
                        .length
                    }
                  </div>
                </div>

                {/* Evening shift */}
                <div className="grid grid-cols-[120px_80px_repeat(31,_30px)_60px] gap-1 mb-1">
                  <div className="bg-white border p-2 text-xs"></div>
                  <div className="bg-indigo-100 text-indigo-800 p-2 text-xs font-medium text-center">
                    {t("attendance.shift.evening")}
                  </div>
                  {days.map((day) => (
                    <div
                      key={`evening-${day}`}
                      className={`p-2 text-xs text-center border ${getCellClass(employeeData, "Evening", day)}`}
                    >
                      {getCellContent(employeeData, "Evening", day)}
                    </div>
                  ))}
                  <div className="bg-white border p-2 text-xs font-bold text-center">
                    {Object.values(employeeData.shifts.Evening).filter((record) => record?.status === "Present").length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onSave} className="bg-green-500 hover:bg-green-600">
            <Save className="h-4 w-4 mr-2" />
            {t("attendance.timesheet.save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
