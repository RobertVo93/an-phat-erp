"use client"

import { FormattedCurrency } from "@/components/ui/formatted-currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatNumberWithCommas } from "@/lib/utils"
import { Boxes, PackageCheck } from "lucide-react"
import type { IStockChangeDetail } from "@/types/stock-change-detail"

interface IStockChangeProductLedgerProps {
  record: IStockChangeDetail
}

export function StockChangeProductLedger({ record }: IStockChangeProductLedgerProps) {
  const { t } = useLanguage()
  const products = record.stockProducts ?? []

  return (
    <Card className="overflow-hidden border-stone-200 shadow-sm">
      <CardHeader className="border-b bg-white">
        <CardTitle className="flex items-center justify-between gap-3 text-lg">
          <span className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-amber-700" />
            {t("stockIn.products")}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
            {products.length} {t("stockIn.products")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {products.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">{t("common.noData")}</div>
        ) : (
          <div className="divide-y">
            {products.map((item, index) => (
              <div key={`${item.id || item.sku || "stock-product"}-${index}`} className="grid grid-cols-1 gap-4 p-4 transition hover:bg-amber-50/40 md:grid-cols-[1.5fr_0.7fr_0.8fr_0.9fr] md:items-center">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-amber-200">
                    <PackageCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">{item.name || "-"}</p>
                    <p className="text-xs text-muted-foreground">{item.sku || "-"}</p>
                  </div>
                </div>

                <div className="flex justify-between gap-3 md:block md:text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("stockIn.form.quantity")}</p>
                  <p className="font-bold">{formatNumberWithCommas(item.quantity ?? 0)}</p>
                </div>

                <div className="flex justify-between gap-3 md:block md:text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("stockIn.form.unitCost")}</p>
                  <FormattedCurrency as="span" className="font-bold" value={item.unitCost ?? 0} />
                </div>

                <div className="flex justify-between gap-3 md:block md:text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("stockIn.form.totalCost")}</p>
                  <FormattedCurrency as="span" className="text-base font-black text-stone-950" value={item.totalCost ?? (item.unitCost ?? 0) * (item.quantity ?? 0)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
