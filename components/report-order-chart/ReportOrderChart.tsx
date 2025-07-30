"use client"

import { IReportOrder, ReportPeriod } from "@/types"
import { useEffect, useState } from "react"
import {
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts"
import { format} from "date-fns"
import { useLanguage } from "@/contexts/language-context"

interface Props {
  data: IReportOrder[]
  reportPeriod: ReportPeriod
}

interface ChartData {
  label: string
  current: number
  previous: number
}

export default function ReportOrderChart({ data, reportPeriod }: Props) {
  const { t } = useLanguage()
  const [chartData, setChartData] = useState<ChartData[]>([])

  function getDateKey(date: Date, period: ReportPeriod): string {
    switch (period) {
      case ReportPeriod.day:
        return format(date, "yyyy-MM-dd")
      case ReportPeriod.month:
        return format(date, "yyyy-MM")
      case ReportPeriod.year:
        return format(date, "yyyy")
    }
  }

  function transformToChartData(data: IReportOrder[], period: ReportPeriod): ChartData[] {
    const priceByKey: Record<string, number> = {}

    for (const order of data) {
      if (!order.deliveryDate || !order.totalPrice) continue
      const key = getDateKey(order.deliveryDate, period)
      priceByKey[key] = (priceByKey[key] || 0) + order.totalPrice
    }

    const sortedKeys = Object.keys(priceByKey).sort()

    const chartData: ChartData[] = sortedKeys.map((key, index) => {
      const current = priceByKey[key] || 0
      const previous = index > 0 ? priceByKey[sortedKeys[index - 1]] || 0 : 0

      return {
        label: key,
        current,
        previous,
      }
    })

    return chartData
  }

  useEffect(() => {
    setChartData(transformToChartData(data, reportPeriod))
  }, [data, reportPeriod])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <Tooltip />
        <Bar dataKey="current" fill="#4CAF50" name={t("ro.chart.current")} yAxisId="left" />
        <Line type="monotone" dataKey="previous" stroke="#ef4444" strokeWidth={2} name={t("ro.chart.previous")}/>
      </ComposedChart>
    </ResponsiveContainer>
  )
}