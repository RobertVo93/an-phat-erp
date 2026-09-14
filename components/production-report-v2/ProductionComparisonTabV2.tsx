"use client"

import { useLanguage } from "@/contexts/language-context"
import {
  IProductionMonthlyComparisonRowV2,
  IProductionReportPeriodLabelsV2,
} from "@/types/report-production-v2.interface"
import { ProductionMetricComparisonChartV2 } from "./ProductionMetricComparisonChartV2"

interface IProductionComparisonTabV2Props {
  data: IProductionMonthlyComparisonRowV2[]
  periodLabels: IProductionReportPeriodLabelsV2
  loading?: boolean
  hasData?: boolean
  hasError?: boolean
}

export function ProductionComparisonTabV2({
  data,
  periodLabels,
  loading = false,
  hasData = false,
  hasError = false,
}: IProductionComparisonTabV2Props) {
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

      <ProductionMetricComparisonChartV2
        metric="cost"
        data={data}
        periodLabels={periodLabels}
        title={t("rp.v2.costComparisonTitle")}
        description={t("rp.v2.costComparisonDescription")}
        tone="orange"
        loading={loading}
        hasData={hasData}
        hasError={hasError}
      />

      <ProductionMetricComparisonChartV2
        metric="profit"
        data={data}
        periodLabels={periodLabels}
        title={t("rp.v2.profitComparisonTitle")}
        description={t("rp.v2.profitComparisonDescription")}
        tone="emerald"
        loading={loading}
        hasData={hasData}
        hasError={hasError}
      />
    </div>
  )
}
