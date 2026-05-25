"use client"

import { Button } from "@/components/ui/button"
import { RangePickerCalendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Product, ReportPeriod } from "@/types"
import { ReportStockFilter } from "@/types/report-stock.interface"
import { Download, Filter } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { ReportStockFilterModal } from "../modals/report-stock-filter-modal"

interface StockReportHeaderFiltersProps {
  filter: ReportStockFilter
  reportPeriod: ReportPeriod
  activeProducts: Product[]
  setFilter: (filters: ReportStockFilter) => void
  setReportPeriod: Dispatch<SetStateAction<ReportPeriod>>
  handleDateRangeChange: (range: { from?: Date; to?: Date } | undefined) => void
}

export function StockReportHeaderFilters({
  filter,
  reportPeriod,
  activeProducts,
  setFilter,
  setReportPeriod,
  handleDateRangeChange,
}: StockReportHeaderFiltersProps) {
  const { t } = useLanguage()
  const [showFilterModal, setShowFilterModal] = useState(false)

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <RangePickerCalendar
        onDateRangeChange={handleDateRangeChange}
        mode={reportPeriod}
        startDate={filter.dateFrom}
        endDate={filter.dateTo}
        showTodayButton
      />

      <Select value={reportPeriod} onValueChange={(value: ReportPeriod) => setReportPeriod(value)}>
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Kỳ báo cáo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ReportPeriod.day}>{t("rp.page.day")}</SelectItem>
          <SelectItem value={ReportPeriod.month}>{t("rp.page.month")}</SelectItem>
          <SelectItem value={ReportPeriod.year}>{t("rp.page.year")}</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowFilterModal((prev) => !prev)}>
        <Filter className="mr-2 h-4 w-4" />
        {t("rs.page.filter")}
      </Button>

      {/* <Button className="w-full sm:w-auto">
        <Download className="mr-2 h-4 w-4" />
        {t("rs.page.export")}
      </Button> */}

      <ReportStockFilterModal
        open={showFilterModal}
        currentFilter={filter}
        activeProducts={activeProducts}
        setCurrentFilter={setFilter}
        setShowFilterModal={setShowFilterModal}
      />
    </div>
  )
}
