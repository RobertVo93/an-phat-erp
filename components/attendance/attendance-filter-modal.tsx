"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Employee } from "@/types"
import { useLanguage } from "@/contexts/language-context"

interface AttendanceFilters {
  date?: Date
  employeeId?: string
}

interface AttendanceFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: AttendanceFilters) => void
  currentFilters: AttendanceFilters
  employees: Employee[]
}

export function AttendanceFilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  employees,
}: AttendanceFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<AttendanceFilters>(currentFilters)

  const handleFilterChange = (key: keyof AttendanceFilters, value: any) => {
    if(value === "all") {
      setFilters({ ...filters, [key]: undefined })
    } else {
      setFilters({ ...filters, [key]: value })
    }
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("attendance.filter.title")}</DialogTitle>
          <DialogDescription>{t("attendance.filter.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">{t("attendance.filter.date")}</Label>
            <br />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !filters.date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date ? format(filters.date, "PPP") : <span>{t("attendance.filter.pickDate")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) => handleFilterChange("date", date)}
                  disabled={(date) => date > addDays(new Date(), 0)}
                  modifiersClassNames={{
                    selected: "bg-blue-500 text-white",
                    disabled: "text-gray-400 opacity-50 cursor-not-allowed",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee">{t("attendance.filter.employee")}</Label>
            <Select value={filters.employeeId || ""} onValueChange={(value) => handleFilterChange("employeeId", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("attendance.filter.allEmployees")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("attendance.filter.allEmployees")}</SelectItem>
                {employees.map((employee, index) => (
                  <SelectItem key={index} value={employee.id!}>
                    <div className="flex flex-col">
                      <span className="font-medium">{employee.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {employee.id} - {employee.department}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" onClick={handleApply}>
            {t("common.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
