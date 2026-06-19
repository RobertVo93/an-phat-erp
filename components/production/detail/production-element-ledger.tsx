"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormattedCurrency } from "@/components/ui/formatted-currency"
import { FormattedNumber } from "@/components/ui/formatted-number"
import { useLanguage } from "@/contexts/language-context"
import type { IProductionElement } from "@/types/production"
import type { LucideIcon } from "lucide-react"
import { PackageCheck } from "lucide-react"

interface IProductionElementLedgerProps {
  title: string
  items: IProductionElement[]
  icon: LucideIcon
  tone: "emerald" | "amber" | "slate"
}

const toneClass = {
  emerald: "text-emerald-700 bg-emerald-50 hover:bg-emerald-50/80",
  amber: "text-amber-700 bg-amber-50 hover:bg-amber-50/80",
  slate: "text-slate-700 bg-slate-50 hover:bg-slate-50/80",
}

export function ProductionElementLedger({ title, items, icon: Icon, tone }: IProductionElementLedgerProps) {
  const { t } = useLanguage()

  return (
    <Card className="overflow-hidden border-stone-200 shadow-sm">
      <CardHeader className="border-b bg-white">
        <CardTitle className="flex items-center justify-between gap-3 text-lg">
          <span className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${toneClass[tone].split(" ")[0]}`} />
            {title}
          </span>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
            {items.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">{t("common.noData")}</div>
        ) : (
          <div className="divide-y">
            {items.map((item, index) => (
              <div key={`${item.id || item.number || title}-${index}`} className={`grid grid-cols-1 gap-4 p-4 transition md:grid-cols-[1.5fr_0.7fr_0.8fr_0.9fr] md:items-center ${toneClass[tone]}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-amber-200">
                    <PackageCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">{item.name || "-"}</p>
                    <p className="text-xs text-muted-foreground">{item.number || item.unit || "-"}</p>
                  </div>
                </div>

                <div className="flex justify-between gap-3 md:block md:text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("production.history.quantity")}</p>
                  <FormattedNumber as="span" className="font-bold" value={item.quantity}/>
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
