"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { EmployeeFilters } from "@/types/employee"
import { useLanguage } from "@/contexts/language-context"

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
                <SelectItem value="Active">{t("employees.status.active")}</SelectItem>
                <SelectItem value="Inactive">{t("employees.status.inactive")}</SelectItem>
                <SelectItem value="On Leave">{t("employees.status.onLeave")}</SelectItem>
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
                <SelectItem value="Full-time">{t("employees.type.fullTime")}</SelectItem>
                <SelectItem value="Part-time">{t("employees.type.partTime")}</SelectItem>
                <SelectItem value="Contract">{t("employees.type.contract")}</SelectItem>
                <SelectItem value="Intern">{t("employees.type.intern")}</SelectItem>
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
                <SelectItem value="IT">{t("employees.departments.it")}</SelectItem>
                <SelectItem value="Marketing">{t("employees.departments.marketing")}</SelectItem>
                <SelectItem value="Finance">{t("employees.departments.finance")}</SelectItem>
                <SelectItem value="Sales">{t("employees.departments.sales")}</SelectItem>
                <SelectItem value="HR">{t("employees.departments.hr")}</SelectItem>
                <SelectItem value="Operations">{t("employees.departments.operations")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("employees.filter.position")}</Label>
            <Input
              placeholder="Enter position..."
              value={filters.position || ""}
              onChange={(e) => updateFilter("position", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("employees.filter.hireDateRange")}</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
              <Input
                type="date"
                placeholder="From"
                value={filters.hireDateFrom || ""}
                onChange={(e) => updateFilter("hireDateFrom", e.target.value)}
              />
              <Input
                type="date"
                placeholder="To"
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
                placeholder="Min salary"
                value={filters.salaryMin || ""}
                onChange={(e) =>
                  updateFilter("salaryMin", e.target.value ? Number.parseInt(e.target.value) : undefined)
                }
              />
              <Input
                type="number"
                placeholder="Max salary"
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
