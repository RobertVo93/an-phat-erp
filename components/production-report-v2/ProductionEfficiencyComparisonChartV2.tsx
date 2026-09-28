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

interface IProductionEfficiencyComparisonChartV2Props {
  data: IProductionMonthlyComparisonRowV2[]
  periodLabels: IProductionReportPeriodLabelsV2
  loading: boolean
  hasData: boolean
  hasError: boolean
}

interface IEfficiencyChartRowV2 {
  date: string
  currentEfficiency: number | null
  previousEfficiency: number | null
}

export function ProductionEfficiencyComparisonChartV2({
  data,
  periodLabels,
  loading,
  hasData,
  hasError,
}: IProductionEfficiencyComparisonChartV2Props) {
  const { t } = useLanguage()
  const chartData = useMemo<IEfficiencyChartRowV2[]>(
    () => data.map((row) => ({
      date: row.date,
      currentEfficiency: row.efficiency.currentValue,
      previousEfficiency: row.efficiency.previousValue,
    })),
    [data],
  )
  const hasEfficiencyData = chartData.some((row) =>
    row.currentEfficiency !== null || row.previousEfficiency !== null,
  )

  return (
    <ProductionChartFrameV2
      title={t("rp.v2.efficiencyComparisonTitle")}
      description={t("rp.v2.efficiencyComparisonDescription")}
      periodLabels={periodLabels}
      loading={loading}
      hasData={hasData && hasEfficiencyData}
      hasError={hasError}
      tone="slate"
      emptyTitle={hasData ? t("rp.v2.noEfficiencyData") : undefined}
      emptyDescription={hasData ? t("rp.v2.noEfficiencyDataDescription") : undefined}
    >
      <div className="overflow-x-auto pb-2">
        <div className="h-[420px] min-w-[720px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 12, right: 20, bottom: 8, left: 8 }}>
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
                  return [`${numericValue}%`, name]
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
                dataKey="currentEfficiency"
                name={t("rp.v2.currentEfficiency")}
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#ffffff", stroke: "#2563eb", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="previousEfficiency"
                name={t("rp.v2.previousEfficiency")}
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#ffffff", stroke: "#f97316", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#f97316", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ProductionChartFrameV2>
  )
}
