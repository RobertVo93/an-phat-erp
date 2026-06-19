"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormattedCurrency } from "@/components/ui/formatted-currency"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import type { IProductionDetail } from "@/types/production-detail"
import type { IProductionElement } from "@/types/production"
import { Banknote, Boxes, Hammer, Zap } from "lucide-react"

interface IProductionCostSummaryCardProps {
  record: IProductionDetail
}

const sumCost = (items: IProductionElement[] = []) => items.reduce((sum, item) => sum + (item.totalCost ?? 0), 0)

export function ProductionCostSummaryCard({ record }: IProductionCostSummaryCardProps) {
  const { t } = useLanguage()
  const materialCost = sumCost(record.materials)
  const utilityCost = sumCost(record.utilities)
  const laborCost = sumCost(record.labors)
  const totalExpense = record.totalExpense ?? materialCost + utilityCost + laborCost
  const revenue = record.totalCost ?? 0

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-emerald-950 bg-emerald-950 text-white shadow-xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Banknote className="h-5 w-5 text-amber-300" />
            {t("production.recordItem.summaryShort")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="flex justify-between gap-4 text-sm text-white/75">
            <span className="flex items-center gap-2"><Boxes className="h-4 w-4" />{t("production.recordItem.materialsShort")}</span>
            <FormattedCurrency as="span" className="font-semibold text-white" value={materialCost} />
          </div>
          <div className="flex justify-between gap-4 text-sm text-white/75">
            <span className="flex items-center gap-2"><Zap className="h-4 w-4" />{t("production.recordItem.utilitiesShort")}</span>
            <FormattedCurrency as="span" className="font-semibold text-white" value={utilityCost} />
          </div>
          <div className="flex justify-between gap-4 text-sm text-white/75">
            <span className="flex items-center gap-2"><Hammer className="h-4 w-4" />{t("production.recordItem.laborShort")}</span>
            <FormattedCurrency as="span" className="font-semibold text-white" value={laborCost} />
          </div>

          <Separator className="bg-white/15" />

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">{t("production.recordItem.totalExpense")}</p>
            <FormattedCurrency as="div" className="text-3xl font-black text-white" value={totalExpense} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{t("production.history.totalRevenue")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormattedCurrency as="div" className="text-2xl font-black text-stone-950" value={revenue} />
        </CardContent>
      </Card>
    </div>
  )
}
