"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"
import { ReportProductionFilter } from "@/types/report-production"
import { Button } from "../ui/button"
import { Product, ReportViewBy } from "@/types"
import { Checkbox } from "@radix-ui/react-checkbox"

interface Props {
  open: boolean
  currentFilter: ReportProductionFilter
  activeProducts: Product[]
  setShowFilterModal: (open: boolean) => void
  setCurrentFilter: (filters: ReportProductionFilter) => void
}

export function ReportProductionFilterModal({
  open,
  currentFilter,
  activeProducts,
  setCurrentFilter,
  setShowFilterModal
}: Props) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState<ReportProductionFilter>(currentFilter)

  const onClose = () => {
    setShowFilterModal(false)
  }

  const handleReset = () => {
    setFilter({ viewBy: ReportViewBy.daily })
    setCurrentFilter({ viewBy: ReportViewBy.daily })

    onClose()
  }

  const handleApply = () => {
    setCurrentFilter(filter)
    onClose()
  }

  const updateFilter = (key: keyof ReportProductionFilter, value: any) => {
    switch (key) {
      case ("products"): {
        setFilter(({ ...filter, products: value }))
        return
      }
      case ("viewBy"): {
        setFilter(({ ...filter, viewBy: value as ReportViewBy }))
        return
      }
      case ("dateFrom"): {
        setFilter(({ ...filter, dateFrom: value }))
        return
      }
      case ("dateTo"): {
        setFilter(({ ...filter, dateTo: value }))
        return
      }
      default: {
        return
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setShowFilterModal}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t("pro.filter.title")}</DialogTitle>
        </DialogHeader>

        {/* select product */}
        <div>
          <Label>{t("pro.filter.product")}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {filter.products?.length
                  ? filter.products.map((p) => p.name).join(", ")
                  : t("pro.filter.searchProduct")}
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

        {/* select view by */}
        <div>
          <Label htmlFor="date">{t("pro.filter.viewBy")}</Label>
          <Select value={filter.viewBy} onValueChange={(value: ReportViewBy) => updateFilter("viewBy", value)}>
            <SelectTrigger className="">
              <SelectValue defaultValue={filter.viewBy?.toString()} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(ReportViewBy).map((vb, ind) => (
                <SelectItem key={ind} value={vb}>{t(`pro.filter.${vb}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* select period */}
        <div>
          <Label htmlFor="date">{t("pro.filter.dateRange")}</Label>
          {filter.viewBy === ReportViewBy.daily &&
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From"
                value={filter.dateFrom || ""}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
              />
              <Input
                type="date"
                placeholder="To"
                value={filter.dateTo || ""}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
              />
            </div>
          }
          {filter.viewBy === ReportViewBy.monthly &&
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="month"
                placeholder="From"
                value={filter.dateFrom || ""}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
              />
              <Input
                type="month"
                placeholder="To"
                value={filter.dateTo || ""}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
              />
            </div>
          }
          {filter.viewBy === ReportViewBy.yearly &&
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder={t(`pro.filter.yearFrom`)}
                value={filter.dateFrom || ""}
                min="2024"
                max="2100"
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
              />
              <Input
                type="number"
                placeholder={t(`pro.filter.yearTo`)}
                value={filter.dateTo || ""}
                min="2024"
                max="2100"
                onChange={(e) => updateFilter("dateTo", e.target.value)}
              />
            </div>
          }
        </div>

        {/* buttons action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleReset} className="flex-1 h-11">
            {t("pro.filter.reset")}
          </Button>
          <Button className="flex-1 h-11" onClick={handleApply}>
            {t("pro.filter.apply")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
