import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { UIDatePicker } from "../ui/datepicker"

interface AttendanceHeaderProps {
  onAdd: () => void
  currentYear: number
  currentMonth: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
  onExport: () => void
}

export const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({ onAdd, currentYear, currentMonth, onMonthChange, onYearChange, onExport }) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("attendance.title")}</h2>
        <p className="text-muted-foreground">{t("attendance.description")}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <UIDatePicker
            selected={new Date(currentYear, currentMonth - 1)}
            onChange={(date) => {
              if (date) {
                onMonthChange(date.getMonth() + 1)
                onYearChange(date.getFullYear())
              }
            }}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </div>
        <Button variant="outline" size="sm" onClick={onExport}> <Download className="mr-2 h-4 w-4" /> {t("attendance.export")} </Button>
        <Button className="w-full sm:w-auto" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {t("attendance.addRecord")}
        </Button>
      </div>
    </div>
  )
}
