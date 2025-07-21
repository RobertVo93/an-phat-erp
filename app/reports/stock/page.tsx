"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChartArea, Download, Filter, Loader2, Table } from "lucide-react"
import { useReportStock } from "@/hooks/useReportStock"
import { ReportStockFilterModal } from "@/components/modals/report-stock-filter-modal"
import { useLanguage } from "@/contexts/language-context"
import { ReportPeriod, ReportViewMode } from "@/types"
import ReportStockTable from "@/components/report-stock-table/ReportStockTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReportStockChart from "@/components/report-stock-chart/ReportStockChart"
import { formatLargeCurrency } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function StockReportPage() {
  const { t } = useLanguage()
  const {
    loading,
    showFilterModal,
    filter,
    activeProducts,
    viewMode,
    reportPeriod,
    data,
    summary,
    locale,

    setViewMode,
    setReportPeriod,
    setFilter,
    setShowFilterModal,
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("rs.page.title")}</h2>
            <p className="text-muted-foreground">{t("rs.page.description")}</p>
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
          <div className="flex space-x-2">
            {/* select period */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[280px] justify-start text-left font-normal")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filter.dateFrom ? (
                    filter.dateTo ? (
                      <>
                        {format(filter.dateFrom, "dd/MM/yyyy", { locale: locale })} -{" "}
                        {format(filter.dateTo, "dd/MM/yyyy", { locale: locale })}
                      </>
                    ) : (
                      format(filter.dateFrom, "dd/MM/yyyy", { locale: locale })
                    )
                  ) : (
                    <span>{t("rp.page.pickDateRange")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  locale={locale}
                  defaultMonth={filter.dateFrom}
                  selected={{ from: filter.dateFrom, to: filter.dateTo }}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  hideWeekdays
                />
              </PopoverContent>
            </Popover>

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
              {t("rs.page.filter")}
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t("rs.page.export")}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("rs.page.totalProduct")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.activeNumber}</div>
              <p className="text-xs text-muted-foreground">{t("rs.page.activeProduct")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("rs.page.lowStock")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.lowStockNumber}</div>
              <p className="text-xs text-muted-foreground">{t("rs.page.productbelowMinimum")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("rs.page.outOfStock")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.outOfStockNumer}</div>
              <p className="text-xs text-muted-foreground">{t("rs.page.productUnavailable")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("rs.page.totalValue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLargeCurrency(summary.totalValue, 1)}</div>
              <p className="text-xs text-muted-foreground">{t("rs.page.currentInventoryValue")}</p>
            </CardContent>
          </Card>
        </div>

        {(data && data.length === 0) ?
          <div className="w-full flex justify-center mt-4">
            {t("rs.page.noStockAction")}
          </div> :
          <div>
            {/* Table */}
            {viewMode === ReportViewMode.table &&
              <div>
                <ReportStockTable data={data} />
              </div>
            }
            {/* Chart */}
            {viewMode === ReportViewMode.chart &&
              <div>
                <ReportStockChart data={data} reportPeriod={reportPeriod} />
              </div>
            }
          </div>
        }
      </div>

      {/* Filter Modal */}
      <ReportStockFilterModal
        open={showFilterModal}
        currentFilter={filter}
        activeProducts={activeProducts}
        setCurrentFilter={setFilter}
        setShowFilterModal={setShowFilterModal}
      />
    </ERPLayout>
  )
}
