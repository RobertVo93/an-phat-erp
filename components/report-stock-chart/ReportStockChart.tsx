"use client"

import { ReportPeriod, StockChangeType } from "@/types"
import { ChartData, IReportStock } from "@/types/report-stock.interface"
import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface Props {
  data: IReportStock[]
  reportPeriod: ReportPeriod
}

export default function ReportStockChart({ data, reportPeriod }: Props) {
  const [chartData, setChartData] = useState<ChartData[]>([])

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
          label = format(date, "yyyy-MM-dd")
          break
        case ReportPeriod.month:
          label = format(date, "yyyy-MM")
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

  useEffect(() => {
    setChartData(transformToChartData(data, reportPeriod))
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="stockIn" fill="#4CAF50" name="Nhập kho" />
        <Bar dataKey="stockOut" fill="#F44336" name="Xuất kho" />
      </BarChart>
    </ResponsiveContainer>
  )
}
