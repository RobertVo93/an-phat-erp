"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { Product } from "@/types"
import type { ProductionFilters } from "@/types/production"
import { ProductionStatus as ProductionStatusEnum } from "@/types"
import { Calendar } from "../ui/calendar"
import { formatYYYYMMDD } from "@/lib/utils"

interface IProductionHistoryFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: ProductionFilters) => void
  currentFilters: ProductionFilters
  products: Product[]
}

const normalizeFilterValue = (value: string) => value === "all" ? undefined : value

export function ProductionHistoryFilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
  products,
}: IProductionHistoryFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<ProductionFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters])

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: ProductionFilters = {}
    setFilters(resetFilters)
    onApply(resetFilters)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("production.history.filterTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="production-status">{t("production.history.status")}</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, status: normalizeFilterValue(value) }))}
            >
              <SelectTrigger id="production-status">
                <SelectValue placeholder={t("production.history.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("production.history.allStatuses")}</SelectItem>
                {Object.values(ProductionStatusEnum).map((status) => (
                  <SelectItem key={status} value={status}>{t(`production.history.${status}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="production-product">{t("production.history.product")}</Label>
            <Select
              value={filters.product || "all"}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, product: normalizeFilterValue(value) }))}
            >
              <SelectTrigger id="production-product">
                <SelectValue placeholder={t("production.history.allProducts")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("production.history.allProducts")}</SelectItem>
                {products.filter((product) => product.id).map((product) => (
                  <SelectItem key={product.id} value={product.id!}>{product.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="production-date-from">{t("production.history.fromDate")}</Label>
              <Calendar
                selected={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                onChange={(date) => setFilters((prev) => ({ ...prev, dateFrom: date ? formatYYYYMMDD(date) : undefined}))}
                dateFormat="yyyy/MM/dd"
                showIcon
                placeholderText="yyyy/MM/ddd"
              />
            </div>
            <div>
              <Label htmlFor="production-date-to">{t("production.history.toDate")}</Label>
              <Calendar
                selected={filters.dateTo ? new Date(filters.dateTo) : undefined}
                onChange={(date) => setFilters((prev) => ({ ...prev, dateTo: date ? formatYYYYMMDD(date) : undefined}))}
                dateFormat="yyyy/MM/dd"
                showIcon
                placeholderText="yyyy/MM/ddd"
              />
            </div>
          </div>

          <div className="flex justify-between space-x-4 pt-4">
            <Button variant="outline" onClick={handleReset}>{t("common.reset")}</Button>
            <Button onClick={handleApply}>{t("common.apply")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
