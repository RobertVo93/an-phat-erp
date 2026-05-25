"use client"

import { ReportPeriod, StockChangeType } from "@/types"
import { ChartData, IReportStock } from "@/types/report-stock.interface"
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts"
import { format } from "date-fns"
import { formatNumberWithCommas } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface Props {
  data: IReportStock[]
  reportPeriod: ReportPeriod
}

export default function ReportStockChart({ data, reportPeriod }: Props) {
  const { t } = useLanguage()

  function transformToChartData(
    data: IReportStock[],
    period: ReportPeriod
  ): ChartData[] {
    const grouped: Record<string, ChartData> = {}

    for (const record of data) {
      const date = new Date(record.date)
      let label = ""

      switch (period) {
        case ReportPeriod.day:
          label = format(date, "dd/MM/yyyy")
          break
        case ReportPeriod.month:
          label = format(date, "MM/yyyy")
          break
        case ReportPeriod.year:
          label = format(date, "yyyy")
          break
      }

      if (!grouped[label]) {
        grouped[label] = { label, stockIn: 0, stockOut: 0 }
      }

      if (record.type === StockChangeType.stockIn) {
        grouped[label].stockIn += record.quantity
      } else if (record.type === StockChangeType.stockOut) {
        grouped[label].stockOut += record.quantity
      }
    }

    return Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label))
  }

  const chartData = useMemo(() => transformToChartData(data, reportPeriod), [data, reportPeriod])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis fontSize={12} tickFormatter={(value: number) => formatNumberWithCommas(value)} />
        <Tooltip formatter={(value: number | undefined, name: string | undefined) => formatNumberWithCommas(Number(value ?? 0))}/>
        <Legend />
        <Bar dataKey="stockIn" fill="#4CAF50" name={t("stockIn.form.stock-in")}>
          <LabelList
            dataKey="stockIn"
            position="top"
            formatter={(value: any) => formatNumberWithCommas(Number(value ?? 0))}
            className="fill-green-600 text-[11px]"
          />
        </Bar>
        <Bar dataKey="stockOut" fill="#F44336" name={t("stockIn.form.stock-out")}>
          <LabelList
            dataKey="stockOut"
            position="top"
            formatter={(value: any) => formatNumberWithCommas(Number(value ?? 0))}
            className="fill-red-600 text-[11px]"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
