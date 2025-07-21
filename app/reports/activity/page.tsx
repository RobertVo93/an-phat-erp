"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts"
import { Download, Filter, TrendingUp, Package, DollarSign, Loader2, CalendarIcon } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useReportProduction } from "@/hooks/useReportProduction"
import { ReportProductionFilterModal } from "@/components/modals/report-production-filter-modal"
import { ReportPeriod } from "@/types"
import { formatLargeCurrency } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function ActivityReportPage() {
  const { t } = useLanguage()

  const {
    loading,
    showFilterModal,
    filter,
    activeProducts,
    reportPeriod,
    comparingProduct,
    productionData,
    monthlyComparisonData,
    productPerformanceData,
    summary,
    locale,

    setComparingProduct,
    setFilter,
    setShowFilterModal,
    setReportPeriod,
    getColorByIndex,
    handleDateRangeChange, 
  } = useReportProduction()

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
            <h2 className="text-3xl font-bold tracking-tight">{t("rp.page.title")}</h2>
            <p className="text-muted-foreground">{t("rp.page.description")}</p>
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
                <SelectValue placeholder="Kỳ báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ReportPeriod.day}>{t(`rp.page.day`)}</SelectItem>
                <SelectItem value={ReportPeriod.month}>{t(`rp.page.month`)}</SelectItem>
                <SelectItem value={ReportPeriod.year}>{t(`rp.page.year`)}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFilterModal((prev) => !prev)}>
              <Filter className="mr-2 h-4 w-4" />
              {t("rp.page.filter")}
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t("rp.page.exportReport")}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("rp.page.totalRevenue")}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLargeCurrency(summary.revenue.thisMonth, 1)}</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">
                  {summary.revenue.growth !== null && summary.revenue.growth !== 0 && (
                    `${summary.revenue.growth > 0 ? "+" : ""}${summary.revenue.growth}% ${t("rp.page.comparedToLastMonth")}`
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("rp.page.totalExpense")}</CardTitle>
              <Package className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLargeCurrency(summary.cost.thisMonth, 1)}</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">
                  {summary.cost.growth !== null && summary.cost.growth !== 0 && (
                    `${summary.cost.growth > 0 ? "+" : ""}${summary.cost.growth}% ${t("rp.page.comparedToLastMonth")}`
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("rp.page.totalProfit")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLargeCurrency(summary.profit.thisMonth, 1)}</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">
                  {summary.profit.growth !== null && summary.profit.growth !== 0 && (
                    `${summary.profit.growth > 0 ? "+" : ""}${summary.profit.growth}% ${t("rp.page.comparedToLastMonth")}`
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different report views */}
        <Tabs defaultValue="production" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="production">{t("rp.page.production")}</TabsTrigger>
            {/* <TabsTrigger value="financial">Tài Chính</TabsTrigger> */}
            <TabsTrigger value="comparison">{t("rp.page.comparison")}</TabsTrigger>
            <TabsTrigger value="products">{t("rp.page.products")}</TabsTrigger>
          </TabsList>

          {/* Production Tab */}
          <TabsContent value="production" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t("rp.page.productionTitle")}</CardTitle>
                  <CardDescription>{t("rp.page.productionDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={productionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis yAxisId="left" fontSize={12} />
                      <YAxis yAxisId="right" orientation="right" fontSize={12} />
                      <Tooltip />
                      {filter.products && filter.products.map((product, index) => (
                        <Bar
                          yAxisId="left"
                          dataKey={product.name!}
                          key={index}
                          fill={getColorByIndex(index)}
                          name={`${product.name} (${t(`rp.page.${product.unit}`)})`}
                        />
                      ))}
                      {filter.products && filter.products.length > 0 &&
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="efficiency"
                          stroke="#1aff1a"
                          strokeWidth={2}
                          name={`${t("rp.page.efficiency")} %`}
                        />
                      }
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("rp.page.monthlyComparisonTitle")}</CardTitle>
                <CardDescription>{t("rp.page.monthlyComparisonDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={comparingProduct?.id}
                  onValueChange={(value) => setComparingProduct(activeProducts.find((product) => product.id === value))}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder={t("rp.page.findComparingProduct")} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeProducts.map((pro, ind) => (
                      <SelectItem value={pro.id!} key={ind}>{pro.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <ResponsiveContainer width="100%" height={400} className="mt-4">
                  <ComposedChart data={monthlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip labelFormatter={(value) => t(`rp.page.${value}`)} />
                    <Bar dataKey="lastYear" fill="#94a3b8" name={t("rp.page.lastYear")} />
                    <Bar dataKey="thisYear" fill="#3b82f6" name={t("rp.page.thisYear")} />
                    <Line type="monotone" dataKey="growth" stroke="#ef4444" strokeWidth={2} name={`${t("rp.page.growth")} %`} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("rp.page.productPerformanceTitle")}</CardTitle>
                <CardDescription>{t("rp.page.productPerformanceDesciprtion")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformanceData.map((product, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{product.product}</h3>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{t("rp.page.profitMargin")}</p>
                          <p className="font-bold text-green-600">{product.margin}%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">{t("rp.page.output")}</p>
                          <p className="font-medium">{product.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t("rp.page.revenue")}</p>
                          <p className="font-medium">{formatLargeCurrency(product.revenue, 1)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t("rp.page.expense")}</p>
                          <p className="font-medium">{formatLargeCurrency(product.cost, 1)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t("rp.page.profit")}</p>
                          <p className="font-medium text-green-600">{formatLargeCurrency(product.profit, 1)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* filter modal */}
      <ReportProductionFilterModal
        open={showFilterModal}
        currentFilter={filter}
        activeProducts={activeProducts}
        setCurrentFilter={setFilter}
        setShowFilterModal={setShowFilterModal}
      />
    </ERPLayout>
  )
}
