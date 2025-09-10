"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, DollarSign, Loader2, Package, ShoppingCart, Users } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { HeaderStats } from "@/hooks/use-homepage"
import { formatLargeCurrency } from "@/lib/utils"

interface HeaderCardsProps {
  stats: HeaderStats | null
  loading: boolean
}

interface StatItem {
  key: keyof HeaderStats
  title: string
  icon: React.ComponentType<{ className?: string }>
  isCurrency?: boolean
}

export function HeaderCards({ stats, loading }: HeaderCardsProps) {
  const { t } = useLanguage()

  const items: StatItem[] = [
    { key: "revenue", title: t("dashboard.totalRevenue"), icon: DollarSign, isCurrency: true },
    { key: "orders", title: t("dashboard.orders"), icon: ShoppingCart },
    { key: "orderedCustomers", title: t("dashboard.customers"), icon: Users },
    { key: "producedProducts", title: t("dashboard.products"), icon: Package },
  ]

  const renderValue = (value: number, isCurrency?: boolean) => (isCurrency ? formatLargeCurrency(value) : value.toLocaleString())

  const getTrend = (current: number, compare: number) => {
    if (compare === 0) return { trend: "up", change: current }
    const change = current - compare
    return { trend: change >= 0 ? "up" : "down", change: Math.abs(change) }
  }

  return (
    <div className="relative grid gap-2 grid-cols-2 md:grid-cols-4">
      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {items.map((item) => {
        const data = stats ? stats[item.key] : { current: 0, lastMonth: 0, lastYear: 0 }
        const { trend, change } = getTrend(data.current, data.lastMonth)
        const { trend: trendYear, change: changeYear } = getTrend(data.current, data.lastYear)
        const Icon = item.icon
        return (
          <Card key={item.key as string}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{renderValue(data.current, item.isCurrency)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {trend === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={trend === "up" ? "text-green-500" : "text-red-500"}>{item.isCurrency ? formatLargeCurrency(change) : change}</span>
                <span className="ml-1">{t("dashboard.lastMonth")}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {trendYear === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={trendYear === "up" ? "text-green-500" : "text-red-500"}>{item.isCurrency ? formatLargeCurrency(changeYear) : changeYear}</span>
                <span className="ml-1">{t("dashboard.lastYear")}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}


