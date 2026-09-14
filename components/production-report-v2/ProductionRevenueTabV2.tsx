"use client"

import { useLanguage } from "@/contexts/language-context"
import {
  IProductionMonthlyComparisonRowV2,
  IProductionReportPeriodLabelsV2,
} from "@/types/report-production-v2.interface"
import { ProductionMetricComparisonChartV2 } from "./ProductionMetricComparisonChartV2"
import { ProductionMetricTrendingChartV2 } from "./ProductionMetricTrendingChartV2"

interface IProductionRevenueTabV2Props {
  data: IProductionMonthlyComparisonRowV2[]
  periodLabels: IProductionReportPeriodLabelsV2
  loading?: boolean
  hasData?: boolean
  hasError?: boolean
}

export function ProductionRevenueTabV2({
  data,
  periodLabels,
  loading = false,
  hasData = false,
  hasError = false,
}: IProductionRevenueTabV2Props) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <ProductionMetricComparisonChartV2
        metric="revenue"
        data={data}
        periodLabels={periodLabels}
        title={t("rp.v2.revenueComparisonTitle")}
        description={t("rp.v2.revenueComparisonDescription")}
        tone="blue"
        loading={loading}
        hasData={hasData}
        hasError={hasError}
      />

      <ProductionMetricTrendingChartV2
        data={data}
        periodLabels={periodLabels}
        loading={loading}
        hasData={hasData}
        hasError={hasError}
      />
    </div>
  )
}
