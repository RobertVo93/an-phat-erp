"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { OrderFilters } from "@/types/order"

interface OrderFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: OrderFilters
  onFiltersChange: (filters: OrderFilters) => void
}

export function OrderFilterModal({ open, onOpenChange, filters, onFiltersChange }: OrderFilterModalProps) {
  const { t } = useLanguage()
  const [localFilters, setLocalFilters] = useState<OrderFilters>(filters)

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
                <SelectItem value="pending">{t("orders.status.pending")}</SelectItem>
                <SelectItem value="processing">{t("orders.status.processing")}</SelectItem>
                <SelectItem value="shipped">{t("orders.status.shipped")}</SelectItem>
                <SelectItem value="delivered">{t("orders.status.delivered")}</SelectItem>
                <SelectItem value="completed">{t("orders.status.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("orders.status.cancelled")}</SelectItem>
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
                <SelectItem value="pending">{t("orders.paymentStatus.pending")}</SelectItem>
                <SelectItem value="paid">{t("orders.paymentStatus.paid")}</SelectItem>
                <SelectItem value="partial">{t("orders.paymentStatus.partial")}</SelectItem>
                <SelectItem value="failed">{t("orders.paymentStatus.failed")}</SelectItem>
                <SelectItem value="refunded">{t("orders.paymentStatus.refunded")}</SelectItem>
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
                <SelectItem value="creditCard">{t("orders.paymentMethod.creditCard")}</SelectItem>
                <SelectItem value="debitCard">{t("orders.paymentMethod.debitCard")}</SelectItem>
                <SelectItem value="bankTransfer">{t("orders.paymentMethod.bankTransfer")}</SelectItem>
                <SelectItem value="cash">{t("orders.paymentMethod.cash")}</SelectItem>
                <SelectItem value="paypal">{t("orders.paymentMethod.paypal")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t("orders.expectedDelivery")}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("orders.filter.dateFrom")}</Label>
                <Input
                  type="date"
                  className="h-11"
                  value={localFilters.dateFrom || ""}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, dateFrom: e.target.value || undefined }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("orders.filter.dateTo")}</Label>
                <Input
                  type="date"
                  className="h-11"
                  value={localFilters.dateTo || ""}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, dateTo: e.target.value || undefined }))}
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
                <Input
                  type="number"
                  placeholder="0"
                  className="h-11"
                  value={localFilters.totalAmountFrom || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      totalAmountFrom: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">{t("orders.filter.amountMax")}</Label>
                <Input
                  type="number"
                  placeholder="999999999"
                  className="h-11"
                  value={localFilters.totalAmountTo || ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      totalAmountTo: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
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
