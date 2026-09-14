"use client"

import { Button } from "@/components/ui/button"
import { RangePickerCalendar } from "@/components/ui/calendar"
import { useLanguage } from "@/contexts/language-context"
import { Product } from "@/types"
import { IReportProductionFilterV2 } from "@/types/report-production-v2.interface"
import { Filter } from "lucide-react"
import { useState } from "react"
import { ProductionReportFilterModalV2 } from "./ProductionReportFilterModalV2"

interface IProductionReportHeaderFiltersV2Props {
  filter: IReportProductionFilterV2
  activeProducts: Product[]
  setFilter: (filters: IReportProductionFilterV2) => void
  handleDateRangeChange: (range: { from?: Date; to?: Date } | undefined) => void
}

export function ProductionReportHeaderFiltersV2({
  filter,
  activeProducts,
  setFilter,
  handleDateRangeChange,
}: IProductionReportHeaderFiltersV2Props) {
  const { t } = useLanguage()
  const [showFilterModal, setShowFilterModalInternal] = useState(false)

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <div className="relative">
        <RangePickerCalendar
          onDateRangeChange={handleDateRangeChange}
          mode="month"
          startDate={filter.dateFrom}
          endDate={filter.dateTo}
          showTodayButton
        />
      </div>

      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => setShowFilterModalInternal((prev) => !prev)}
      >
        <Filter className="mr-2 h-4 w-4" />
        {t("rp.page.filter")}
      </Button>

      {/* <Button className="w-full sm:w-auto">
        <Download className="mr-2 h-4 w-4" />
        {t("rp.page.exportReport")}
      </Button> */}
      <ProductionReportFilterModalV2
        open={showFilterModal}
        currentFilter={filter}
        activeProducts={activeProducts}
        setCurrentFilter={setFilter}
        setShowFilterModal={setShowFilterModalInternal}
      />
    </div>
  )
}
