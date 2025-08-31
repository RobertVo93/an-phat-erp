"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { PayrollFilters } from "@/types/payroll"
import { useLanguage } from "@/contexts/language-context"
import { PayrollStatus } from "@/types"
import { formatNumberWithCommas, parseNumberInput } from "@/lib/utils"

interface PayrollFilterModalProps {
  isOpen: boolean
  currentFilters: PayrollFilters
  onClose: () => void
  onApply: (filters: PayrollFilters) => void
}

export function PayrollFilterModal({ isOpen, currentFilters, onClose, onApply }: PayrollFilterModalProps) {
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
                {
                  Object.values(PayrollStatus).map((status) => (
                    <SelectItem key={status} value={status}>{t(`payroll.status.${status}`)}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("payroll.filter.salaryRange")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input 
                id="salaryMin"
                type="text"
                placeholder={t("payroll.filter.minSalary")}
                value={formatNumberWithCommas(filters.salaryMin ?? 0)}
                onChange={(e) => {
                  const salaryMin = parseNumberInput(e.target.value) || undefined;
                  setFilters((prev) => ({ ...prev, salaryMin }));
                }}
              />
              <Input 
                id="salaryMax"
                type="text"
                placeholder={t("payroll.filter.maxSalary")}
                value={formatNumberWithCommas(filters.salaryMax ?? 0)}
                onChange={(e) => {
                  const salaryMax = parseNumberInput(e.target.value) || undefined;
                  setFilters((prev) => ({ ...prev, salaryMax }));
                }}
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
