"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { PayrollFilters } from "@/types/payroll"
import { useLanguage } from "@/contexts/language-context"

interface PayrollFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: PayrollFilters) => void
  currentFilters: PayrollFilters
}

export function PayrollFilterModal({ isOpen, onClose, onApply, currentFilters }: PayrollFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<PayrollFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: PayrollFilters = {}
    setFilters(resetFilters)
    onApply(resetFilters)
    onClose()
  }

  const updateFilter = (key: keyof PayrollFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("payroll.filter.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("payroll.filter.status")}</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("payroll.filter.all")}</SelectItem>
                <SelectItem value="Processed">{t("payroll.status.processed")}</SelectItem>
                <SelectItem value="Pending">{t("payroll.status.pending")}</SelectItem>
                <SelectItem value="Failed">{t("payroll.status.failed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("payroll.filter.department")}</Label>
            <Select
              value={filters.department || "all"}
              onValueChange={(value) => updateFilter("department", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("payroll.filter.all")}</SelectItem>
                <SelectItem value="IT">{t("payroll.departments.it")}</SelectItem>
                <SelectItem value="Marketing">{t("payroll.departments.marketing")}</SelectItem>
                <SelectItem value="Finance">{t("payroll.departments.finance")}</SelectItem>
                <SelectItem value="Sales">{t("payroll.departments.sales")}</SelectItem>
                <SelectItem value="HR">{t("payroll.departments.hr")}</SelectItem>
                <SelectItem value="Operations">{t("payroll.departments.operations")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("payroll.filter.position")}</Label>
            <Input
              placeholder="Enter position..."
              value={filters.position || ""}
              onChange={(e) => updateFilter("position", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("payroll.filter.payPeriod")}</Label>
            <Select
              value={filters.payPeriod || "all"}
              onValueChange={(value) => updateFilter("payPeriod", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("payroll.filter.all")}</SelectItem>
                <SelectItem value="January 2024">January 2024</SelectItem>
                <SelectItem value="December 2023">December 2023</SelectItem>
                <SelectItem value="November 2023">November 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("payroll.filter.salaryRange")}</Label>
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
            {t("payroll.filter.reset")}
          </Button>
          <Button onClick={handleApply}>{t("payroll.filter.apply")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
