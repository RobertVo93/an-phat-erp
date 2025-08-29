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
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Employee } from "@/types"
import { useLanguage } from "@/contexts/language-context"
import { AttendanceFilters } from "@/types/attendance"

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
                        {employee.number} - {employee.department}
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
