"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"
import { cn, renderDeltaPercent } from "@/lib/utils"
import {
  IProductionSummaryV2,
} from "@/types/report-production-v2.interface"
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  ChartNoAxesCombined,
  Minus,
  ReceiptText,
  type LucideIcon,
} from "lucide-react"
import { FormattedCurrency } from "../ui/formatted-currency"

interface IProductionReportHeaderCardsV2Props {
  summary: IProductionSummaryV2
  loading?: boolean
}

interface ISummaryCardConfig {
  key: keyof IProductionSummaryV2
  title: string
  icon: LucideIcon
  accentClassName: string
  iconClassName: string
}

export function ProductionReportHeaderCardsV2({
  summary,
  loading = false,
}: IProductionReportHeaderCardsV2Props) {
  const { t } = useLanguage()
  const cards: ISummaryCardConfig[] = [
    {
      key: "revenue",
      title: t("rp.page.totalRevenue"),
      icon: BadgeDollarSign,
      accentClassName: "bg-blue-600",
      iconClassName: "bg-blue-50 text-blue-700",
    },
    {
      key: "cost",
      title: t("rp.page.totalExpense"),
      icon: ReceiptText,
      accentClassName: "bg-orange-500",
      iconClassName: "bg-orange-50 text-orange-700",
    },
    {
      key: "profit",
      title: t("rp.page.totalProfit"),
      icon: ChartNoAxesCombined,
      accentClassName: "bg-emerald-600",
      iconClassName: "bg-emerald-50 text-emerald-700",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const metric = summary[card.key]
        const difference = metric.value - metric.previousValue
        const isIncrease = difference > 0
        const isDecrease = difference < 0
        const MetricIcon = card.icon
        const TrendIcon = isIncrease ? ArrowUpRight : isDecrease ? ArrowDownRight : Minus
        const trendLabel = metric.changePercentage === null
          ? t("rp.v2.notAvailable")
          : renderDeltaPercent(metric.changePercentage)

        return (
          <Card
            key={card.key}
            className="group relative overflow-hidden border-border/70 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className={cn("absolute inset-x-0 top-0 h-1", card.accentClassName)} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-5">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", card.iconClassName)}>
                <MetricIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-5">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <FormattedCurrency as="div" className="text-2xl font-bold tracking-tight lg:text-3xl" value={metric.value}/>
                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-dashed pt-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-muted-foreground">
                        {t("rp.page.samePeriodLastYear")}
                      </p>
                      <FormattedCurrency as="span" className="mt-1 text-sm font-semibold text-foreground/80" value={metric.previousValue}/>
                    </div>
                    <div
                      className={cn(
                        "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums",
                        isIncrease && "bg-emerald-50 text-emerald-700",
                        isDecrease && "bg-red-50 text-red-700",
                        !isIncrease && !isDecrease && "bg-muted text-muted-foreground",
                      )}
                      title={t("rp.v2.changeComparedToPreviousYear")}
                    >
                      <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {trendLabel}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
