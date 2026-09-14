"use client"

import { useLanguage } from "@/contexts/language-context"
import { formatLargeCurrency } from "@/lib/utils"
import {
  IProductionMonthlyComparisonRowV2,
  IProductionReportPeriodLabelsV2,
  ProductionReportMetricV2,
} from "@/types/report-production-v2.interface"
import { useMemo } from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ProductionChartFrameV2, ProductionChartToneV2 } from "./ProductionChartFrameV2"

interface IProductionMetricComparisonChartV2Props {
  metric: ProductionReportMetricV2
  data: IProductionMonthlyComparisonRowV2[]
  periodLabels: IProductionReportPeriodLabelsV2
  title: string
  description: string
  tone: ProductionChartToneV2
  loading: boolean
  hasData: boolean
  hasError: boolean
}

interface IMetricChartRowV2 {
  date: string
  currentValue: number
  previousValue: number
  changePercentage: number | null
}

export function ProductionMetricComparisonChartV2({
  metric,
  data,
  periodLabels,
  title,
  description,
  tone,
  loading,
  hasData,
  hasError,
}: IProductionMetricComparisonChartV2Props) {
  const { t } = useLanguage()
  const percentageLabel = t("rp.v2.changePercentage")
  const chartData = useMemo<IMetricChartRowV2[]>(
    () => data.map((row) => ({
      date: row.date,
      currentValue: row[metric].currentValue,
      previousValue: row[metric].previousValue,
      changePercentage: row[metric].changePercentage,
    })),
    [data, metric],
  )

  return (
    <ProductionChartFrameV2
      title={title}
      description={description}
      periodLabels={periodLabels}
      loading={loading}
      hasData={hasData}
      hasError={hasError}
      tone={tone}
    >
      <div className="overflow-x-auto pb-2">
        <div className="h-[420px] min-w-[720px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 12, right: 8, bottom: 8, left: 8 }}
              barGap={4}
              barCategoryGap="24%"
            >
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                dy={8}
              />
              <YAxis
                yAxisId="value"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value: number) => formatLargeCurrency(value)}
                width={86}
              />
              <YAxis
                yAxisId="percentage"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(value: number) => `${value}%`}
                width={52}
              />
              <ReferenceLine yAxisId="percentage" y={0} stroke="#94a3b8" strokeDasharray="3 3" />
              <Tooltip
                cursor={{ fill: "#f1f5f9", opacity: 0.7 }}
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.10)",
                }}
                formatter={(value, name) => {
                  const numericValue = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0)
                  return name === percentageLabel
                    ? [`${numericValue > 0 ? "+" : ""}${numericValue}%`, name]
                    : [formatLargeCurrency(numericValue), name]
                }}
                labelFormatter={(value) => `${value}`}
              />
              <Legend
                verticalAlign="bottom"
                height={42}
                iconType="circle"
                wrapperStyle={{ paddingTop: "18px", fontSize: "13px" }}
              />
              <Bar
                yAxisId="value"
                dataKey="currentValue"
                fill="#2563eb"
                name={t("rp.page.currentPeriod")}
                radius={[5, 5, 0, 0]}
                maxBarSize={44}
              />
              <Bar
                yAxisId="value"
                dataKey="previousValue"
                fill="#f97316"
                name={t("rp.page.samePeriodLastYear")}
                radius={[5, 5, 0, 0]}
                maxBarSize={44}
              />
              <Line
                yAxisId="percentage"
                type="monotone"
                dataKey="changePercentage"
                name={percentageLabel}
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#ffffff", stroke: "#059669", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#059669", stroke: "#ffffff", strokeWidth: 2 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ProductionChartFrameV2>
  )
}
