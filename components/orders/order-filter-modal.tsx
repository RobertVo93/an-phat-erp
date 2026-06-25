"use client"

import { useEffect, useState } from "react"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { formatYYYYMMDD, parseFilterDate } from "@/lib/utils.date"
import type { OrderFilters } from "@/types/order"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types"

interface OrderFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: OrderFilters
  onFiltersChange: (filters: OrderFilters) => void
}

export function OrderFilterModal({ open, onOpenChange, filters, onFiltersChange }: OrderFilterModalProps) {
  const { t } = useLanguage()
  const [localFilters, setLocalFilters] = useState<OrderFilters>(filters)

  useEffect(() => {
    if (open) {
      setLocalFilters(filters)
    }
  }, [filters, open])

  const handleApply = () => {
    onFiltersChange(localFilters)
    onOpenChange(false)
  }

  const handleReset = () => {
    const emptyFilters: OrderFilters = {}
    setLocalFilters(emptyFilters)
    onFiltersChange(emptyFilters)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t("orders.filterOrders")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("orders.status")}</Label>
            <Select
              value={localFilters.status || ""}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, status: value || undefined }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t("orders.filter.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("orders.filter.allStatuses")}</SelectItem>
                {Object.keys(OrderStatus).map((status, index) => (
                  <SelectItem key={index} value={status}>{t(`orders.status.${status}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("orders.paymentStatus")}</Label>
            <Select
              value={localFilters.paymentStatus || ""}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, paymentStatus: value || undefined }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t("orders.filter.allPaymentStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("orders.filter.allPaymentStatuses")}</SelectItem>
                {Object.keys(PaymentStatus).map((status, index) => (
                  <SelectItem key={index} value={status}>{t(`orders.paymentStatus.${status}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("orders.paymentMethod")}</Label>
            <Select
              value={localFilters.paymentMethod || ""}
              onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, paymentMethod: value || undefined }))}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t("orders.filter.allPaymentMethods")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("orders.filter.allPaymentMethods")}</SelectItem>
                {Object.keys(PaymentMethod).map((method, index) => (
                  <SelectItem key={index} value={method}>{t(`orders.paymentMethod.${method}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("orders.expectedDelivery")}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("orders.filter.dateFrom")}</Label>
                <Calendar
                  selected={parseFilterDate(localFilters.dateFrom)}
                  maxDate={parseFilterDate(localFilters.dateTo) ?? undefined}
                  onChange={(date) => setLocalFilters((prev) => ({
                    ...prev,
                    dateFrom: date ? formatYYYYMMDD(date) : undefined,
                  }))}
                  isClearable
                  placeholderText="dd/MM/yyyy"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("orders.filter.dateTo")}</Label>
                <Calendar
                  selected={parseFilterDate(localFilters.dateTo)}
                  minDate={parseFilterDate(localFilters.dateFrom) ?? undefined}
                  onChange={(date) => setLocalFilters((prev) => ({
                    ...prev,
                    dateTo: date ? formatYYYYMMDD(date) : undefined,
                  }))}
                  isClearable
                  placeholderText="dd/MM/yyyy"
                />
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("orders.filter.amountRange")}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("orders.filter.amountMin")}</Label>
                <QuantitySelector
                  quantity={localFilters.totalAmountFrom ?? 0}
                  min={0}
                  max={localFilters.totalAmountTo ?? Number.MAX_SAFE_INTEGER}
                  showAction={false}
                  onQuantityChange={(value) => setLocalFilters((prev) => ({
                    ...prev,
                    totalAmountFrom: value === 0 ? undefined : value,
                  }))}
                  className="h-11"
                  inputClassName="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("orders.filter.amountMax")}</Label>
                <QuantitySelector
                  quantity={localFilters.totalAmountTo ?? 0}
                  min={0}
                  max={Number.MAX_SAFE_INTEGER}
                  showAction={false}
                  onQuantityChange={(value) => setLocalFilters((prev) => ({
                    ...prev,
                    totalAmountTo: value === 0 ? undefined : value,
                  }))}
                  className="h-11"
                  inputClassName="text-left"
                />
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("orders.customer")}</Label>
            <Input
              placeholder={t("orders.filter.customerPlaceholder")}
              className="h-11"
              value={localFilters.customer || ""}
              onChange={(e) => setLocalFilters((prev) => ({ ...prev, customer: e.target.value || undefined }))}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1 h-11">
            {t("orders.filter.reset")}
          </Button>
          <Button onClick={handleApply} className="flex-1 h-11">
            {t("orders.filter.apply")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
