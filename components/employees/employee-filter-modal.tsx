"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { EmployeeFilters } from "@/types/employee"
import { useLanguage } from "@/contexts/language-context"
import { EmployeeDepartment, EmployeeStatus, EmployeeType } from "@/types"
import { Calendar } from "@/components/ui/calendar"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { formatYYYYMMDD, parseFilterDate } from "@/lib/utils.date"

interface EmployeeFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: EmployeeFilters) => void
  currentFilters: EmployeeFilters
}

export function EmployeeFilterModal({ isOpen, onClose, onApply, currentFilters }: EmployeeFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<EmployeeFilters>(currentFilters)
  const salaryMinRef = useRef(currentFilters.salaryMin)
  const salaryMaxRef = useRef(currentFilters.salaryMax)

  useEffect(() => {
    setFilters(currentFilters)
    salaryMinRef.current = currentFilters.salaryMin
    salaryMaxRef.current = currentFilters.salaryMax
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApply({
      ...filters,
      salaryMin: salaryMinRef.current,
      salaryMax: salaryMaxRef.current,
    })
    onClose()
  }

  const handleReset = () => {
    const resetFilters: EmployeeFilters = {}
    setFilters(resetFilters)
    salaryMinRef.current = undefined
    salaryMaxRef.current = undefined
    onApply(resetFilters)
    onClose()
  }

  const updateFilter = (key: keyof EmployeeFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  const updateSalaryMin = (value: number) => {
    const salaryMin = value === 0 ? undefined : value
    salaryMinRef.current = salaryMin
    updateFilter("salaryMin", salaryMin)
  }

  const updateSalaryMax = (value: number) => {
    const salaryMax = value === 0 ? undefined : value
    salaryMaxRef.current = salaryMax
    updateFilter("salaryMax", salaryMax)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("employees.filter.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("employees.filter.status")}</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("employees.filter.all")}</SelectItem>
                {Object.keys(EmployeeStatus).map((status, index) => (
                  <SelectItem key={index} value={status}>{t(`employees.status.${status}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("employees.filter.employeeType")}</Label>
            <Select
              value={filters.employeeType || "all"}
              onValueChange={(value) => updateFilter("employeeType", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("employees.filter.all")}</SelectItem>
                {Object.keys(EmployeeType).map((type, index) => (
                  <SelectItem key={index} value={type}>{t(`employees.type.${type}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("employees.filter.department")}</Label>
            <Select
              value={filters.department || "all"}
              onValueChange={(value) => updateFilter("department", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("employees.filter.all")}</SelectItem>
                {Object.keys(EmployeeDepartment).map((department, index) => (
                  <SelectItem key={index} value={department}>{t(`employees.departments.${department}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("employees.filter.position")}</Label>
            <Input
              placeholder={t("employees.filter.enterPosition")}
              value={filters.position || ""}
              onChange={(e) => updateFilter("position", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("employees.filter.hireDateRange")}</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("employees.filter.from")}</Label>
                <Calendar
                  selected={parseFilterDate(filters.hireDateFrom)}
                  maxDate={parseFilterDate(filters.hireDateTo) ?? undefined}
                  onChange={(date) =>
                    updateFilter("hireDateFrom", date ? formatYYYYMMDD(date) : undefined)
                  }
                  placeholderText="dd/MM/yyyy"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("employees.filter.to")}</Label>
                <Calendar
                  selected={parseFilterDate(filters.hireDateTo)}
                  minDate={parseFilterDate(filters.hireDateFrom) ?? undefined}
                  onChange={(date) =>
                    updateFilter("hireDateTo", date ? formatYYYYMMDD(date) : undefined)
                  }
                  placeholderText="dd/MM/yyyy"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("employees.filter.salaryRange")}</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("employees.filter.minSalary")}</Label>
                <QuantitySelector
                  quantity={filters.salaryMin ?? 0}
                  min={0}
                  max={filters.salaryMax ?? Number.MAX_SAFE_INTEGER}
                  showAction={false}
                  onQuantityChange={updateSalaryMin}
                  className="h-11"
                  inputClassName="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("employees.filter.maxSalary")}</Label>
                <QuantitySelector
                  quantity={filters.salaryMax ?? 0}
                  min={0}
                  max={Number.MAX_SAFE_INTEGER}
                  showAction={false}
                  onQuantityChange={updateSalaryMax}
                  className="h-11"
                  inputClassName="text-left"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleReset}>
            {t("employees.filter.reset")}
          </Button>
          <Button onClick={handleApply}>{t("employees.filter.apply")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
