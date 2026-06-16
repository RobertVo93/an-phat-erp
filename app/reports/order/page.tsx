"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartArea, Download, Filter, Loader2, Table } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { ReportPeriod, ReportViewMode } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatLargeCurrency } from "@/lib/utils"
import { RangePickerCalendar } from "@/components/ui/calendar"
import { useReportOrder } from "@/hooks/useReportOrder"
import { ReportOrderFilterModal } from "@/components/modals/report-order-filter-modal"
import ReportOrderTable from "@/components/report-order-table/ReportOrderTable"
import ReportOrderChart from "@/components/report-order-chart/ReportOrderChart"

export default function StockReportPage() {
  const { t } = useLanguage()
  const {
    loading,
    showFilterModal,
    filter,
    activeCustomers,
    viewMode,
    reportPeriod,
    data,
    summary,

    setViewMode,
    setReportPeriod,
    setFilter,
    setShowFilterModal,
    handleDateRangeChange
  } = useReportOrder()

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("ro.page.title")}</h2>
            <p className="text-muted-foreground">{t("ro.page.description")}</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === ReportViewMode.table ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(ReportViewMode.table)}
            >
              <Table className="mr-2 h-4 w-4" />
              {t("ro.page.table")}
            </Button>
            <Button
              variant={viewMode === ReportViewMode.chart ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(ReportViewMode.chart)}
            >
              <ChartArea className="mr-2 h-4 w-4" />
              {t("ro.page.chart")}
            </Button>
          </div>
          <div className="flex space-x-2">
            <RangePickerCalendar
              onDateRangeChange={handleDateRangeChange}
              mode={reportPeriod}
              startDate={filter.dateFrom}
              endDate={filter.dateTo}
              showTodayButton
            />

            <Select value={reportPeriod} onValueChange={(value: ReportPeriod) => setReportPeriod(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ReportPeriod.day}>{t(`rp.page.day`)}</SelectItem>
                <SelectItem value={ReportPeriod.month}>{t(`rp.page.month`)}</SelectItem>
                <SelectItem value={ReportPeriod.year}>{t(`rp.page.year`)}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFilterModal((prev) => !prev)}>
              <Filter className="mr-2 h-4 w-4" />
              {t("ro.page.filter")}
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t("ro.page.export")}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("ro.page.statusCompleted")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.statusCompleted}</div>
              <p className="text-xs text-muted-foreground">/ {summary.totalOrders} {t("ro.page.totalOrders")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("ro.page.statusPending")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.statusPending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("ro.page.totalValue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLargeCurrency(summary.totalValue)}</div>
              <p className="text-xs text-muted-foreground">{t("ro.page.totalCompletedOrdersValue")}</p>
            </CardContent>
          </Card>
        </div>

        {(data && data.length === 0) ?
          <div className="w-full flex justify-center mt-4">
            {t("ro.page.noOrder")}
          </div> :
          <div>
            {/* Table */}
            {viewMode === ReportViewMode.table &&
              <div>
                <ReportOrderTable data={data} />
              </div>
            }
            {/* Chart */}
            {viewMode === ReportViewMode.chart &&
              <div>
                <ReportOrderChart data={data} reportPeriod={reportPeriod} />
              </div>
            }
          </div>
        }
      </div>

      {/* Filter Modal */}
      <ReportOrderFilterModal
        open={showFilterModal}
        currentFilter={filter}
        activeCustomers={activeCustomers}
        setCurrentFilter={setFilter}
        setShowFilterModal={setShowFilterModal}
      />
    </ERPLayout>
  )
}
