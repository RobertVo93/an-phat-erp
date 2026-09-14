"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useProductionReportV2 } from "@/hooks/useReportProductionV2"
import { ProductionComparisonTabV2 } from "./ProductionComparisonTabV2"
import { ProductionReportHeaderCardsV2 } from "./ProductionReportHeaderCardsV2"
import { ProductionReportHeaderFiltersV2 } from "./ProductionReportHeaderFiltersV2"
import { ProductionRevenueTabV2 } from "./ProductionRevenueTabV2"

export function ProductionReportPageClientV2() {
  const { t } = useLanguage()
  const {
    loading,
    hasError,
    hasData,
    filter,
    activeProducts,
    summary,
    comparisonData,
    periodLabels,
    setFilter,
    handleDateRangeChange,
  } = useProductionReportV2()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("rp.page.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("rp.page.description")}</p>
        </div>

        <ProductionReportHeaderFiltersV2
          filter={filter}
          handleDateRangeChange={handleDateRangeChange}
          activeProducts={activeProducts}
          setFilter={setFilter}
        />
      </div>

      <ProductionReportHeaderCardsV2
        summary={summary}
        loading={loading}
      />

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-slate-100 p-1.5">
          <TabsTrigger className="rounded-lg py-2.5" value="revenue">
            {t("rp.v2.page.overview")}
          </TabsTrigger>
          <TabsTrigger className="rounded-lg py-2.5" value="comparison">
            {t("rp.page.comparison")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <ProductionRevenueTabV2
            data={comparisonData}
            periodLabels={periodLabels}
            loading={loading}
            hasData={hasData}
            hasError={hasError}
          />
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          <ProductionComparisonTabV2
            data={comparisonData}
            periodLabels={periodLabels}
            loading={loading}
            hasData={hasData}
            hasError={hasError}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
