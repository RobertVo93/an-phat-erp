"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatLargeCurrency, renderDeltaLabel } from "@/lib/utils"
import { ProductionComparisonChartDataset } from "@/types"
import { Bar, CartesianGrid, ComposedChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ProductionComparisonTabProps {
  comparisonChartData: ProductionComparisonChartDataset[]
}

export function ProductionComparisonTab({ comparisonChartData }: ProductionComparisonTabProps) {
  const { t } = useLanguage()
  const deltaLabelContent = (props: any) =>
    renderDeltaLabel({ ...props, value: props.value === false ? undefined : props.value })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("rp.page.comparison")}</CardTitle>
        <CardDescription>{t("rp.page.comparisonDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {comparisonChartData.map((dataset) => (
          <div key={dataset.metric} className="rounded-lg border p-4">
            <h3 className="mb-3 text-base font-semibold">{t(dataset.titleKey)}</h3>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={dataset.rows}>
                <CartesianGrid strokeDasharray="3 3" />
                <Legend verticalAlign="bottom" height={36} />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis fontSize={12}  tickFormatter={(value: number | undefined) => formatLargeCurrency(value ?? 0, 1)}/>
                <Tooltip formatter={(value: number | undefined) => formatLargeCurrency(value ?? 0, 1)} labelFormatter={(value) => `${value}`} />
                <Bar dataKey="current" fill="#2563eb" name={`1. ${t("rp.page.currentPeriod")}`}>
                  <LabelList
                    dataKey="current"
                    position="top"
                    formatter={(value: any) => formatLargeCurrency(Number(value ?? 0))}
                    className="fill-blue-600 text-[11px]"
                  />
                </Bar>
                <Bar dataKey="baseline1" fill="#ea580c" name={`2. ${t(dataset.baseline1LabelKey)}`}>
                  <LabelList
                    dataKey="baseline1Percent"
                    position="top"
                    content={deltaLabelContent}
                  />
                </Bar>
                {dataset.baseline2LabelKey && (
                  <Bar dataKey="baseline2" fill="#a855f7" name={`3. ${t(dataset.baseline2LabelKey)}`}>
                      <LabelList
                        dataKey="baseline2Percent"
                        position="top"
                        content={deltaLabelContent}
                      />
                  </Bar>
                )}
                {dataset.baseline3LabelKey && (
                  <Bar dataKey="baseline3" fill="#16a34a" name={`4. ${t(dataset.baseline3LabelKey)}`}>
                    <LabelList
                      dataKey="baseline3Percent"
                      position="top"
                      content={deltaLabelContent}
                    />
                  </Bar>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
