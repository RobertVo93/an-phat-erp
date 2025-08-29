import { useLanguage } from "@/contexts/language-context"
import { AttendanceShift, AttendanceStatus, TimesheetData } from "@/types"
import type { AttendanceRecord } from "@/types/attendance"

interface ITimesheetShiftProps {
    employeeData: TimesheetData
    days: number[]
    shift: AttendanceShift
    onCellClick: (record: AttendanceRecord | null, employeeData: TimesheetData, shift: AttendanceShift, day: number) => void
}

export const TimesheetShift = ({ employeeData, days, shift, onCellClick }: ITimesheetShiftProps) => {
    const { t } = useLanguage()

    const getCellContent = (employeeData: TimesheetData, shift: AttendanceShift, day: number) => {
        const record = employeeData.shifts[shift as keyof typeof employeeData.shifts][day.toString()]
        if (record?.status === AttendanceStatus.completed) {
            return "x"
        }
        else if (record) {
            return "-"
        }
        return ""
    }

    const getCellClass = (employeeData: TimesheetData, shift: AttendanceShift, day: number) => {
        const record = employeeData?.shifts?.[shift as keyof typeof employeeData.shifts]?.[day.toString()]
        if (record?.status === AttendanceStatus.completed) {
            return "bg-green-400 text-gray font-bold"
        }
        else if (record) {
            return "bg-orange-400 text-white"
        }
        return "bg-gray-100 text-gray-400"
    }

    return (
        <div
            className="grid gap-1 mb-1"
            style={{ gridTemplateColumns: `120px 80px repeat(${days.length}, 30px) 60px` }}
        >
            <div className="bg-white border p-2 text-xs font-medium text-center">{employeeData.employeeName}</div>
            <div className="bg-orange-100 text-orange-800 p-2 text-xs font-medium text-center">
                {t(`attendance.shift.${shift}`)}
            </div>
            {days.map((day) => {
                const record = employeeData.shifts[shift as keyof typeof employeeData.shifts][day.toString()] || null
                return (
                    <div
                        key={`morning-${day}`}
                        className={`p-2 text-xs text-center border ${getCellClass(employeeData, shift, day)} hover:cursor-pointer hover:bg-green-300`}
                        onClick={() => onCellClick(record, employeeData, shift, day)}
                    >
                        {getCellContent(employeeData, shift, day)}
                    </div>
                )
            })}
            <div className="bg-white border p-2 text-xs font-bold text-center">
                {Object.values(employeeData.shifts[shift]).filter((record) => record?.status === AttendanceStatus.completed).length}
            </div>
        </div>
    )
}