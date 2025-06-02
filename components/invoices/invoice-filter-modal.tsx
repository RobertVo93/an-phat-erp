"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { InvoiceFilters } from "@/types/invoice"

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
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="draft">{t("invoices.status.draft")}</SelectItem>
                <SelectItem value="sent">{t("invoices.status.sent")}</SelectItem>
                <SelectItem value="paid">{t("invoices.status.paid")}</SelectItem>
                <SelectItem value="partial">{t("invoices.status.partial")}</SelectItem>
                <SelectItem value="overdue">{t("invoices.status.overdue")}</SelectItem>
                <SelectItem value="cancelled">{t("invoices.status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingPeriodFrom">Kỳ hóa đơn từ</Label>
              <Input
                id="billingPeriodFrom"
                placeholder="MM/YYYY"
                value={filters.billingPeriodFrom || ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, billingPeriodFrom: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingPeriodTo">Kỳ hóa đơn đến</Label>
              <Input
                id="billingPeriodTo"
                placeholder="MM/YYYY"
                value={filters.billingPeriodTo || ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, billingPeriodTo: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amountFrom">Số tiền từ</Label>
              <Input
                id="amountFrom"
                type="number"
                placeholder="0"
                value={filters.amountFrom || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, amountFrom: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountTo">Số tiền đến</Label>
              <Input
                id="amountTo"
                type="number"
                placeholder="0"
                value={filters.amountTo || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, amountTo: e.target.value ? Number(e.target.value) : undefined }))
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button onClick={handleApply}>Áp dụng</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
