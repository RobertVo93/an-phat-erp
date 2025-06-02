import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Factory, Package, Zap, TrendingUp } from "lucide-react"

interface ProductionSummaryCardsProps {
  todayProduction: number
  materialCost: number
  utilityCost: number
  efficiency: number
}

export function ProductionSummaryCards({
  todayProduction,
  materialCost,
  utilityCost,
  efficiency,
}: ProductionSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Sản Lượng Hôm Nay</CardTitle>
          <Factory className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{todayProduction} kg</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+12%</span> so với hôm qua
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Chi Phí NL</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{materialCost}M đ</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-600">+5%</span> so với hôm qua
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Chi Phí TI</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{utilityCost}M đ</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">-3%</span> so với hôm qua
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Hiệu Suất</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{efficiency}%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600">+2%</span> so với hôm qua
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
