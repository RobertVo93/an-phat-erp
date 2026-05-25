"use client"

import { useState } from "react"
import ReportStockChart from "@/components/report-stock-chart/ReportStockChart"
import ReportStockTable from "@/components/report-stock-table/ReportStockTable"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ReportPeriod, ReportViewMode } from "@/types"
import { IReportStock } from "@/types/report-stock.interface"
import { ChartArea, Table } from "lucide-react"

interface StockOverviewTabProps {
  data: IReportStock[]
  reportPeriod: ReportPeriod
}

export function StockOverviewTab({ data, reportPeriod }: StockOverviewTabProps) {
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<ReportViewMode>(ReportViewMode.table)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === ReportViewMode.table ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode(ReportViewMode.table)}
        >
          <Table className="mr-2 h-4 w-4" />
          {t("rs.page.table")}
        </Button>
        <Button
          variant={viewMode === ReportViewMode.chart ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode(ReportViewMode.chart)}
        >
          <ChartArea className="mr-2 h-4 w-4" />
          {t("rs.page.chart")}
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="flex w-full justify-center py-8">{t("rs.page.noStockAction")}</div>
      ) : viewMode === ReportViewMode.table ? (
        <ReportStockTable data={data} />
      ) : (
        <ReportStockChart data={data} reportPeriod={reportPeriod} />
      )}
    </div>
  )
}
