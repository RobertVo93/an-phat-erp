"use client"

import { ERPLayout } from "@/components/erp-layout"
import { 
  ProductionOverviewTab, 
  ProductionComparisonTab, 
  ProductionReportHeaderCards, 
  ProductionReportHeaderFilters,
  ProductionProductsTab
} from "@/components/production-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useProductionReport } from "@/hooks/useReportProduction"
import { Loader2 } from "lucide-react"

export default function ProductionReportPage() {
  const { t } = useLanguage()
  const {
    loading,
    filter,
    activeProducts,
    reportPeriod,
    productionData,
    productPerformanceData,
    summary,
    comparisonChartData,
    setFilter,
    setReportPeriod,
    handleDateRangeChange,
  } = useProductionReport()

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("rp.page.title")}</h2>
            <p className="text-muted-foreground">{t("rp.page.description")}</p>
          </div>

          <ProductionReportHeaderFilters
            filter={filter}
            reportPeriod={reportPeriod}
            setReportPeriod={setReportPeriod}
            handleDateRangeChange={handleDateRangeChange}
            activeProducts={activeProducts}
            setFilter={setFilter}
          />
        </div>

        <ProductionReportHeaderCards summary={summary} />

        <Tabs defaultValue="production" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="production">{t("rp.page.revenue")}</TabsTrigger>
            <TabsTrigger value="comparison">{t("rp.page.comparison")}</TabsTrigger>
            <TabsTrigger value="products">{t("rp.page.products")}</TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="space-y-6">
            <ProductionOverviewTab productionData={productionData} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <ProductionComparisonTab comparisonChartData={comparisonChartData} />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductionProductsTab productPerformanceData={productPerformanceData} />
          </TabsContent>
        </Tabs>
      </div>
    </ERPLayout>
  )
}
