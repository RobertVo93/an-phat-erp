"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatLargeCurrency } from "@/lib/utils"
import { StockReportSummary } from "@/types/report-stock.interface"

interface StockReportHeaderCardsProps {
  summary: StockReportSummary
}

export function StockReportHeaderCards({ summary }: StockReportHeaderCardsProps) {
  const { t } = useLanguage()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t("rs.page.totalProduct")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.activeNumber}</div>
          <p className="text-xs text-muted-foreground">{t("rs.page.activeProduct")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t("rs.page.lowStock")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.lowStockNumber}</div>
          <p className="text-xs text-muted-foreground">{t("rs.page.productbelowMinimum")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t("rs.page.outOfStock")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.outOfStockNumber}</div>
          <p className="text-xs text-muted-foreground">{t("rs.page.productUnavailable")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{t("rs.page.totalValue")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatLargeCurrency(summary.totalValue)}</div>
          <p className="text-xs text-muted-foreground">{t("rs.page.currentInventoryValue")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
