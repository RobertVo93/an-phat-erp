import { Button } from "@/components/ui/button"
import { List, Grid3X3, Download } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { AttendanceViewMode } from "@/types/attendance"

interface AttendanceViewModeToggleProps {
  viewMode: AttendanceViewMode
  setViewMode: (mode: AttendanceViewMode) => void
}

export const AttendanceViewModeToggle: React.FC<AttendanceViewModeToggleProps> = ({ viewMode, setViewMode }) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-row justify-between gap-2">
      <Button className="w-full" variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}> <List className="mr-2 h-4 w-4" /> {t("attendance.listView")} </Button>
      <Button className="w-full" variant={viewMode === "timesheet" ? "default" : "outline"} size="sm" onClick={() => setViewMode("timesheet")}> <Grid3X3 className="mr-2 h-4 w-4" /> {t("attendance.timesheetView")} </Button>
    </div>
  )
}
