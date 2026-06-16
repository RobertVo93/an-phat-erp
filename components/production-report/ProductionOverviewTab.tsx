"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatLargeCurrency } from "@/lib/utils"
import { ProductionReportRow } from "@/types"
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface ProductionOverviewTabProps {
  productionData: ProductionReportRow[]
}

export function ProductionOverviewTab({ productionData }: ProductionOverviewTabProps) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={productionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <Legend verticalAlign="bottom" height={36} />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis yAxisId="left" fontSize={12} tickFormatter={(value: number) => formatLargeCurrency(value)} />
            <YAxis yAxisId="right" orientation="right" fontSize={12} />
            <Tooltip
              formatter={(value: number | undefined, name: string | undefined) =>
                name == t("rp.page.efficiency") ? `${value ?? 0}%` : formatLargeCurrency(Number(value ?? 0))
              }
              labelFormatter={(value: any) => `${value}`}
            />
            <Bar yAxisId="left" dataKey="revenue" fill="#2563eb" name={`1. ${t("rp.page.revenue")}`}>
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(value: any) => formatLargeCurrency(Number(value ?? 0))}
                className="fill-blue-600 text-[11px]"
              />
            </Bar>
            <Bar yAxisId="left" dataKey="cost" fill="#ea580c" name={`2. ${t("rp.page.expense")}`}>
              <LabelList
                dataKey="cost"
                position="top"
                formatter={(value: any) => formatLargeCurrency(Number(value ?? 0))}
                className="fill-orange-600 text-[11px]"
              />
            </Bar>
            <Area yAxisId="right" type="monotone" dataKey="efficiency" stroke="#16a34a" strokeWidth={2} name={`${t("rp.page.efficiency")}`} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
