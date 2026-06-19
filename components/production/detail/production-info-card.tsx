"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormattedNumber } from "@/components/ui/formatted-number"
import { useLanguage } from "@/contexts/language-context"
import { formatDate } from "@/lib/utils"
import type { IProductionDetail } from "@/types/production-detail"
import { CalendarDays, ClipboardList, Factory, Package, UserRound, Warehouse } from "lucide-react"

interface IProductionInfoCardProps {
  record: IProductionDetail
}

export function ProductionInfoCard({ record }: IProductionInfoCardProps) {
  const { t } = useLanguage()
  const items = [
    { icon: Package, label: t("production.detail.product"), value: record.product?.name || "-" },
    { icon: ClipboardList, label: t("production.detail.quantity"), value: <FormattedNumber value={record.quantity} /> },
    { icon: CalendarDays, label: t("production.detail.date"), value: record.date ? formatDate(record.date) : "-" },
    { icon: Warehouse, label: t("production.detail.warehouse"), value: record.warehouse?.name || "-" },
    { icon: UserRound, label: t("production.detail.operator"), value: record.pic?.name || "-" },
    { icon: Factory, label: t("production.history.status"), value: record.status ? t(`production.history.${record.status}`) : "-" },
  ]

  return (
    <Card className="overflow-hidden border-emerald-100 shadow-sm">
      <CardHeader className="border-b bg-emerald-50/60">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Factory className="h-5 w-5 text-emerald-700" />
          {t("production.detail.productionInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Icon className="h-4 w-4 text-emerald-700" />
              {label}
            </div>
            <div className="text-base font-bold text-stone-950">{value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
