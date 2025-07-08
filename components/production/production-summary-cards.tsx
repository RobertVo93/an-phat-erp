import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Package, Zap, TrendingUp } from "lucide-react"

interface ProductionSummaryCardsProps {
  materialCost: number
  utilityCost: number
  employeeCost: number
}

export function ProductionSummaryCards({
  materialCost,
  utilityCost,
  employeeCost
}: ProductionSummaryCardsProps) {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{t("production.summary.materialCost")}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{materialCost}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{t("production.summary.utilityCost")}</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{utilityCost}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{t("production.summary.employeeCost")}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{employeeCost}</div>
        </CardContent>
      </Card>
    </div>
  )
}
