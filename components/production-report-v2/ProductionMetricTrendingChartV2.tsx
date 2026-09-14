"use client"

import { useLanguage } from "@/contexts/language-context"
import {
  IProductionMonthlyComparisonRowV2,
  IProductionReportPeriodLabelsV2,
} from "@/types/report-production-v2.interface"
import { useMemo } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ProductionChartFrameV2 } from "./ProductionChartFrameV2"

interface IProductionMetricTrendingChartV2Props {
  data: IProductionMonthlyComparisonRowV2[]
  periodLabels: IProductionReportPeriodLabelsV2
  loading: boolean
  hasData: boolean
  hasError: boolean
}

interface IChangeTrendRowV2 {
  date: string
  revenueChange: number | null
  costChange: number | null
  profitChange: number | null
}

export function ProductionMetricTrendingChartV2({
  data,
  periodLabels,
  loading,
  hasData,
  hasError,
}: IProductionMetricTrendingChartV2Props) {
  const { t } = useLanguage()
  const trendData = useMemo<IChangeTrendRowV2[]>(
    () => data.map((row) => ({
      date: row.date,
      revenueChange: row.revenue.changePercentage,
      costChange: row.cost.changePercentage,
      profitChange: row.profit.changePercentage,
    })),
    [data],
  )
  const hasComparableData = trendData.some((row) =>
    row.revenueChange !== null || row.costChange !== null || row.profitChange !== null,
  )
  const trendHasData = hasData && hasComparableData

  return (
    <ProductionChartFrameV2
      title={t("rp.v2.changeTrendsTitle")}
      description={t("rp.v2.changeTrendsDescription")}
      periodLabels={periodLabels}
      loading={loading}
      hasData={trendHasData}
      hasError={hasError}
      tone="slate"
      emptyTitle={hasData ? t("rp.v2.noComparableData") : undefined}
      emptyDescription={hasData ? t("rp.v2.noComparableDataDescription") : undefined}
    >
      <div className="overflow-x-auto pb-2">
        <div className="h-[420px] min-w-[720px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 12, right: 20, bottom: 8, left: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value: number) => `${value}%`}
                width={64}
              />
              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="4 4" />
              <Tooltip
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.10)",
                }}
                formatter={(value, name) => {
                  const numericValue = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0)
                  return [`${numericValue > 0 ? "+" : ""}${numericValue}%`, name]
                }}
                labelFormatter={(value) => `${value}`}
              />
              <Legend
                verticalAlign="bottom"
                height={42}
                iconType="circle"
                wrapperStyle={{ paddingTop: "18px", fontSize: "13px" }}
              />
              <Line
                type="monotone"
                dataKey="revenueChange"
                name={t("rp.v2.revenueChange")}
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#ffffff", stroke: "#2563eb", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="costChange"
                name={t("rp.v2.costChange")}
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#ffffff", stroke: "#f97316", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#f97316", stroke: "#ffffff", strokeWidth: 2 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="profitChange"
                name={t("rp.v2.profitChange")}
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#ffffff", stroke: "#059669", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ProductionChartFrameV2>
  )
}
