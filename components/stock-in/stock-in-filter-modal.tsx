"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { StockInFilters } from "@/types/stock-in"

interface StockInFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: StockInFilters) => void
  currentFilters: StockInFilters
}

export function StockInFilterModal({ isOpen, onClose, onApply, currentFilters }: StockInFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<StockInFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: StockInFilters = {}
    setFilters(resetFilters)
    onApply(resetFilters)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("stockIn.filter.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="status">{t("stockIn.status")}</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value || undefined }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("stockIn.filter.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("stockIn.filter.allStatuses")}</SelectItem>
                <SelectItem value="draft">{t("stockIn.status.draft")}</SelectItem>
                <SelectItem value="pending">{t("stockIn.status.pending")}</SelectItem>
                <SelectItem value="in_transit">{t("stockIn.status.in_transit")}</SelectItem>
                <SelectItem value="completed">{t("stockIn.status.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("stockIn.status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supplier">{t("stockIn.supplier")}</Label>
            <Input
              id="supplier"
              value={filters.supplier || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, supplier: e.target.value || undefined }))}
              placeholder={t("stockIn.supplier")}
            />
          </div>

          <div>
            <Label htmlFor="warehouse">{t("stockIn.warehouse")}</Label>
            <Input
              id="warehouse"
              value={filters.warehouse || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, warehouse: e.target.value || undefined }))}
              placeholder={t("stockIn.warehouse")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">{t("stockIn.filter.dateFrom")}</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value || undefined }))}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">{t("stockIn.filter.dateTo")}</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value || undefined }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amountFrom">{t("stockIn.filter.amountFrom")}</Label>
              <Input
                id="amountFrom"
                type="number"
                value={filters.amountFrom || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, amountFrom: Number.parseInt(e.target.value) || undefined }))
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="amountTo">{t("stockIn.filter.amountTo")}</Label>
              <Input
                id="amountTo"
                type="number"
                value={filters.amountTo || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, amountTo: Number.parseInt(e.target.value) || undefined }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-between space-x-4 pt-4">
            <Button variant="outline" onClick={handleReset}>
              {t("stockIn.filter.reset")}
            </Button>
            <Button onClick={handleApply}>{t("stockIn.filter.apply")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
