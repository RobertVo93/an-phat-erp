"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Product, ReportPeriod, ReportProductionFilter } from "@/types"
import { Filter } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { ReportProductionFilterModal } from "../modals/report-production-filter-modal"
import { RangePickerCalendar } from "@/components/ui/calendar"

interface ProductionReportHeaderFiltersProps {
  filter: ReportProductionFilter
  reportPeriod: ReportPeriod
  activeProducts: Product[]
  setFilter: (filters: ReportProductionFilter) => void
  setReportPeriod: Dispatch<SetStateAction<ReportPeriod>>
  handleDateRangeChange: (range: { from?: Date; to?: Date } | undefined) => void
}

export function ProductionReportHeaderFilters({
  filter,
  reportPeriod,
  activeProducts,
  setFilter,
  setReportPeriod,
  handleDateRangeChange,
}: ProductionReportHeaderFiltersProps) {
  const { t } = useLanguage()
  const [showFilterModal, setShowFilterModalInternal] = useState(false)

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <div className="relative">
        <RangePickerCalendar
          onDateRangeChange={handleDateRangeChange}
          mode={reportPeriod}
          startDate={filter.dateFrom}
          endDate={filter.dateTo}
          showTodayButton
        />
      </div>

      <Select value={reportPeriod} onValueChange={(value: ReportPeriod) => setReportPeriod(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Kỳ báo cáo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ReportPeriod.day}>{t("rp.page.day")}</SelectItem>
          <SelectItem value={ReportPeriod.month}>{t("rp.page.month")}</SelectItem>
          <SelectItem value={ReportPeriod.year}>{t("rp.page.year")}</SelectItem>
        </SelectContent>
      </Select>

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
      <ReportProductionFilterModal
        open={showFilterModal}
        currentFilter={filter}
        activeProducts={activeProducts}
        setCurrentFilter={setFilter}
        setShowFilterModal={setShowFilterModalInternal}
      />
    </div>
  )
}
