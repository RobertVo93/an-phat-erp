"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatLargeCurrency, formatNumberWithCommas } from "@/lib/utils"
import { ProductionProductPerformance } from "@/types"

interface ProductionProductsTabProps {
  productPerformanceData: ProductionProductPerformance[]
}

export function ProductionProductsTab({ productPerformanceData }: ProductionProductsTabProps) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("rp.page.productPerformanceTitle")}</CardTitle>
        <CardDescription>{t("rp.page.productPerformanceDesciprtion")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productPerformanceData.map((product) => (
            <div key={product.product} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{product.product}</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{t("rp.page.profitMargin")}</p>
                  <p className="font-bold text-green-600">{product.margin}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="text-gray-600">{t("rp.page.output")}</p>
                  <p className="font-medium">{formatNumberWithCommas(product.quantity)}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t("rp.page.revenue")}</p>
                  <p className="font-medium">{formatLargeCurrency(product.revenue, 1)}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t("rp.page.expense")}</p>
                  <p className="font-medium">{formatLargeCurrency(product.cost, 1)}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t("rp.page.profit")}</p>
                  <p className="font-medium text-green-600">{formatLargeCurrency(product.profit, 1)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
