"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { Product } from "@/types"
import { Checkbox } from "@radix-ui/react-checkbox"
import { getCurrentWeekRange } from "@/lib/period_utils"
import { ReportStockFilter } from "@/types/report-stock.interface"

interface Props {
  open: boolean
  currentFilter: ReportStockFilter
  activeProducts: Product[]
  setShowFilterModal: (open: boolean) => void
  setCurrentFilter: (filters: ReportStockFilter) => void
}

export function ReportStockFilterModal({
  open,
  currentFilter,
  activeProducts,
  setCurrentFilter,
  setShowFilterModal
}: Props) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<ReportStockFilter>(currentFilter)

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

  const updateFilter = (key: keyof ReportStockFilter, value: any) => {
    switch (key) {
      case ("products"): {
        if (!filter.products || filter.products?.length! < 5) {
          setFilter(({ ...filter, products: value }))
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
          <DialogTitle className="text-lg sm:text-xl">{t("rp.filter.filter")}</DialogTitle>
        </DialogHeader>

        {/* select product */}
        <div>
          <Label>{t("rp.filter.product")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {filter.products?.length
                  ? filter.products.map((p) => p.name).join(", ")
                  : t("rp.filter.searchProduct")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-h-60 overflow-y-auto p-0" align="start">
              <div className="flex flex-col gap-2">
                {activeProducts
                  .filter((product) => !filter.products?.some((p) => p.id === product.id))
                  .map((product) => (
                    <label key={product.id} className="flex items-center hover:bg-slate-300 cursor-pointer px-2 py-1 transition-all duration-300">
                      <Checkbox
                        checked={false}
                        onCheckedChange={(checked) => {
                          const selected = filter.products || []
                          updateFilter("products", [...selected, product])
                        }}
                      />
                      <span>{product.name}</span>
                    </label>
                  ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Danh sách sản phẩm đã chọn */}
          {filter.products?.length! > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filter.products?.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    updateFilter(
                      "products",
                      filter.products?.filter((p) => p.id !== product.id)
                    )
                  }
                >
                  <span>{product.name}</span>
                  <span className="text-gray-500">×</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* buttons action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1 h-11">
            {t("rp.filter.reset")}
          </Button>
          <Button className="flex-1 h-11" onClick={handleApply}>
            {t("rp.filter.apply")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
