"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Customer, OrderStatus, PaymentMethod, ReportOrderFilter } from "@/types"
import { Checkbox } from "@radix-ui/react-checkbox"
import { getCurrentWeekRange } from "@/lib/period_utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  open: boolean
  currentFilter: ReportOrderFilter
  activeCustomers: Customer[]
  setShowFilterModal: (open: boolean) => void
  setCurrentFilter: (filters: ReportOrderFilter) => void
}

export function ReportOrderFilterModal({
  open,
  currentFilter,
  activeCustomers,
  setCurrentFilter,
  setShowFilterModal
}: Props) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<ReportOrderFilter>(currentFilter)

  const onClose = () => {
    setShowFilterModal(false)
  }

  const handleReset = () => {
    const [mon, sun] = getCurrentWeekRange()
    setFilter({ dateFrom: mon, dateTo: sun })
    setCurrentFilter({ dateFrom: mon, dateTo: sun })

    onClose()
  }

  const handleApply = () => {
    setCurrentFilter(filter)
    onClose()
  }

  const updateFilter = (key: keyof ReportOrderFilter, value: any) => {
    switch (key) {
      case ("customers"): {
        if (!filter.customers || filter.customers?.length! < 5) {
          setFilter(({ ...filter, customers: value }))
        }
        return
      }
      case ("status"): {
        if(value === "all") {
          setFilter(({ ...filter, status: undefined}))
          return
        }
        setFilter(({ ...filter, status: value as OrderStatus }))
        return
      }
      case ("paymentMethod"): {
        setFilter(({ ...filter, paymentMethod: value as PaymentMethod }))
        if(value === "all") {
          setFilter(({ ...filter, paymentMethod: undefined}))
          return
        }
        return
      }
      case ("dateFrom"): {
        setFilter(({ ...filter, dateFrom: new Date(value) }))
        return
      }
      case ("dateTo"): {
        setFilter(({ ...filter, dateTo: new Date(value) }))
        return
      }
      default: {
        return
      }
    }
  }

  useEffect(() => {
    setFilter(currentFilter)
  }, [currentFilter])

  return (
    <Dialog open={open} onOpenChange={setShowFilterModal}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t("ro.filter.filter")}</DialogTitle>
        </DialogHeader>

        {/* select customers */}
        <div>
          <Label>{t("ro.filter.customer")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {filter.customers?.length
                  ? filter.customers.map((c) => c.name).join(", ")
                  : t("ro.filter.searchCustomer")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-h-60 overflow-y-auto p-0" align="start">
              <div className="flex flex-col gap-2">
                {activeCustomers
                  .filter((customer) => !filter.customers?.some((c) => c.id === customer.id))
                  .map((customer) => (
                    <label key={customer.id} className="flex items-center hover:bg-slate-300 cursor-pointer px-2 py-1 transition-all duration-300">
                      <Checkbox
                        checked={false}
                        onCheckedChange={(checked) => {
                          const selected = filter.customers || []
                          updateFilter("customers", [...selected, customer])
                        }}
                      />
                      <span>{customer.name}</span>
                    </label>
                  ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* selected customers */}
          {filter.customers?.length! > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filter.customers?.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    updateFilter(
                      "customers",
                      filter.customers?.filter((p) => p.id !== customer.id)
                    )
                  }
                >
                  <span>{customer.name}</span>
                  <span className="text-gray-500">×</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* status filter */}
        <div>
          <Label>{t("ro.filter.status")}</Label>
          <Select value={filter.status ?? "all"} onValueChange={(value: OrderStatus) => updateFilter("status", value)}>
            <SelectTrigger className="w-full">
              <SelectValue defaultValue="all" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t(`ro.status.all`)}</SelectItem>
              {Object.keys(OrderStatus).map((status, index) => (
                <SelectItem key={index} value={status}>{t(`ro.status.${status}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* payment method filter */}
        <div>
          <Label>{t("ro.filter.paymentMethod")}</Label>
          <Select value={filter.paymentMethod ?? "all"} onValueChange={(value: PaymentMethod) => updateFilter("paymentMethod", value)}>
            <SelectTrigger className="w-full">
              <SelectValue defaultValue="all" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t(`ro.payment.all`)}</SelectItem>
              {Object.keys(PaymentMethod).map((method, index) => (
                <SelectItem key={index} value={method}>{t(`ro.payment.${method}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* buttons action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1 h-11">
            {t("ro.filter.reset")}
          </Button>
          <Button className="flex-1 h-11" onClick={handleApply}>
            {t("ro.filter.apply")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
