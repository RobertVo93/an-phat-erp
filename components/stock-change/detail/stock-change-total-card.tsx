"use client"

import { FormattedCurrency } from "@/components/ui/formatted-currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { Banknote, NotebookText } from "lucide-react"
import type { IStockChangeDetail } from "@/types/stock-change-detail"

interface IStockChangeTotalCardProps {
  record: IStockChangeDetail
  taxRate: number
}

export function StockChangeTotalCard({ record, taxRate }: IStockChangeTotalCardProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-stone-900 bg-stone-950 text-white shadow-xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Banknote className="h-5 w-5 text-amber-300" />
            {t("stockIn.totalAmount")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="flex justify-between gap-4 text-sm text-white/75">
            <span>{t("stockIn.form.subtotal")}</span>
            <FormattedCurrency as="span" className="font-semibold text-white" value={record.subtotal ?? 0} />
          </div>

          {taxRate > 0 && (
            <div className="flex justify-between gap-4 text-sm text-white/75">
              <span>{t("stockIn.form.tax")} ({taxRate}%)</span>
              <FormattedCurrency as="span" className="font-semibold text-white" value={record.tax ?? 0} />
            </div>
          )}

          <div className="flex justify-between gap-4 text-sm text-white/75">
            <span>{t("stockIn.form.discount")}</span>
            <FormattedCurrency as="span" className="font-semibold text-red-300" value={-(record.discount ?? 0)} />
          </div>

          <Separator className="bg-white/15" />

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-200">{t("stockIn.totalAmount")}</p>
            <FormattedCurrency as="div" className="text-3xl font-black text-white" value={record.totalAmount ?? 0} />
          </div>
        </CardContent>
      </Card>

      {record.notes && (
        <Card className="border-amber-200 bg-amber-50/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <NotebookText className="h-4 w-4 text-amber-700" />
              {t("stockIn.notes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-6 text-stone-700">{record.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
