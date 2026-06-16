"use client"

import { useLanguage } from "@/contexts/language-context"
import { formatLargeCurrency } from "@/lib/utils"
import { ProductionSummary } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductionReportHeaderCardsProps {
  summary: ProductionSummary
}

export function ProductionReportHeaderCards({ summary }: ProductionReportHeaderCardsProps) {
  const { t } = useLanguage()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t("rp.page.totalRevenue")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLargeCurrency(summary.revenue.value)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t("rp.page.totalExpense")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLargeCurrency(summary.cost.value)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t("rp.page.totalProfit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLargeCurrency(summary.profit.value)}</div>
        </CardContent>
      </Card>
    </div>
  )
}
