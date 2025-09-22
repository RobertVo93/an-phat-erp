"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { EmployeeFilters } from "@/types/employee"
import { useLanguage } from "@/contexts/language-context"
import { EmployeeDepartment, EmployeeStatus, EmployeeType } from "@/types"

interface EmployeeFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: EmployeeFilters) => void
  currentFilters: EmployeeFilters
}

export function EmployeeFilterModal({ isOpen, onClose, onApply, currentFilters }: EmployeeFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<EmployeeFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: EmployeeFilters = {}
    setFilters(resetFilters)
    onApply(resetFilters)
    onClose()
  }

  const updateFilter = (key: keyof EmployeeFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
              <Input
                type="date"
                placeholder={t("employees.filter.from")}
                value={filters.hireDateFrom || ""}
                onChange={(e) => updateFilter("hireDateFrom", e.target.value)}
              />
              <Input
                type="date"
                placeholder={t("employees.filter.to")}
                value={filters.hireDateTo || ""}
                onChange={(e) => updateFilter("hireDateTo", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("employees.filter.salaryRange")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder={t("employees.filter.minSalary")}
                value={filters.salaryMin || ""}
                onChange={(e) =>
                  updateFilter("salaryMin", e.target.value ? Number.parseInt(e.target.value) : undefined)
                }
              />
              <Input
                type="number"
                placeholder={t("employees.filter.maxSalary")}
                value={filters.salaryMax || ""}
                onChange={(e) =>
                  updateFilter("salaryMax", e.target.value ? Number.parseInt(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            {t("employees.filter.reset")}
          </Button>
          <Button onClick={handleApply}>{t("employees.filter.apply")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
