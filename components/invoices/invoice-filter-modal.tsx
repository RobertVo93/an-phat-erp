"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { InvoiceFilters } from "@/types/invoice"
import { InvoiceStatus } from "@/types"
import { UIDatePicker } from "@/components/ui/datepicker"
import { MoneyInput } from "@/components/common/input"
import { getEndOfMonth } from "@/lib/utils"

interface InvoiceFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: InvoiceFilters) => void
  currentFilters: InvoiceFilters
}

export function InvoiceFilterModal({ isOpen, onClose, onApply, currentFilters }: InvoiceFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<InvoiceFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters({})
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("invoices.filter")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">{t("invoices.status")}</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value === "all" ? undefined : value }))
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("invoices.status.allStatuses")}</SelectItem>
                {Object.keys(InvoiceStatus).map((status) => (
                  <SelectItem key={status} value={status}>{t(`invoices.status.${status}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingPeriodFrom">{t("invoices.status.periodFrom")}</Label>
              <UIDatePicker
                selected={filters.dueDateFrom!}
                onChange={(date) => setFilters((prev) => ({ ...prev, dueDateFrom: date! }))}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                showIcon
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingPeriodTo">{t("invoices.status.periodTo")}</Label>
              <UIDatePicker
                selected={filters.dueDateTo!}
                onChange={(date) => setFilters((prev) => ({ ...prev, dueDateTo: getEndOfMonth(date!) }))}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                showIcon
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amountFrom">{t("invoices.status.moneyFrom")}</Label>
              <MoneyInput
                id="amountFrom"
                placeholder="0"
                value={filters.amountFrom!}
                onChange={(value) => setFilters((prev) => ({ ...prev, amountFrom: value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountTo">{t("invoices.status.moneyTo")}</Label>
              <MoneyInput
                id="amountTo"
                placeholder="0"
                value={filters.amountTo!}
                onChange={(value) => setFilters((prev) => ({ ...prev, amountTo: value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            {t("invoices.status.rest")}
          </Button>
          <Button onClick={handleApply}>{t("invoices.status.apply")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
