"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Loader2 } from "lucide-react"
import { useReportStock } from "@/hooks/useReportStock"
import { useLanguage } from "@/contexts/language-context"
import { StockOverviewTab, StockReportHeaderCards, StockReportHeaderFilters } from "@/components/stock-report"

export default function StockReportPage() {
  const { t } = useLanguage()
  const {
    loading,
    filter,
    activeProducts,
    reportPeriod,
    data,
    summary,
    setReportPeriod,
    setFilter,
    handleDateRangeChange
  } = useReportStock()

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("rs.page.title")}</h2>
            <p className="text-muted-foreground">{t("rs.page.description")}</p>
          </div>

          <StockReportHeaderFilters
            filter={filter}
            reportPeriod={reportPeriod}
            activeProducts={activeProducts}
            setFilter={setFilter}
            setReportPeriod={setReportPeriod}
            handleDateRangeChange={handleDateRangeChange}
          />
        </div>

        <StockReportHeaderCards summary={summary} />
        <StockOverviewTab data={data} reportPeriod={reportPeriod} />
      </div>
    </ERPLayout>
  )
}
