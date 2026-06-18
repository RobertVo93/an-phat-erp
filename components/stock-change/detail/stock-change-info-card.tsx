"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatDateTime } from "@/lib/utils"
import { Calendar, Factory, Hash, Truck, User, Warehouse } from "lucide-react"
import type React from "react"
import type { IStockChangeDetail } from "@/types/stock-change-detail"

interface IInfoItemProps {
  icon: React.ReactNode
  label: string
  value?: React.ReactNode
}

interface IStockChangeInfoCardProps {
  record: IStockChangeDetail
}

function InfoItem({ icon, label, value }: IInfoItemProps) {
  return (
    <div className="group rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700 group-hover:bg-amber-100 group-hover:text-amber-700">
        {icon}
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm font-bold text-stone-900">{value || "-"}</div>
    </div>
  )
}

export function StockChangeInfoCard({ record }: IStockChangeInfoCardProps) {
  const { t } = useLanguage()

  return (
    <Card className="overflow-hidden border-stone-200 shadow-sm">
      <CardHeader className="border-b bg-stone-50/80">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Factory className="h-5 w-5 text-amber-700" />
          {t("stockIn.form.title.view")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
        <InfoItem icon={<Hash className="h-4 w-4" />} label={t("stockIn.stockType")} value={t(`stockIn.form.${record.type}`)} />
        <InfoItem icon={<Calendar className="h-4 w-4" />} label={t("stockIn.date")} value={record.date ? formatDateTime(record.date) : undefined} />
        <InfoItem icon={<Warehouse className="h-4 w-4" />} label={t("stockIn.warehouse")} value={record.warehouse?.name} />
        <InfoItem icon={<Truck className="h-4 w-4" />} label={t("stockIn.supplier")} value={record.supplier} />
        <InfoItem icon={<User className="h-4 w-4" />} label={t("stockIn.receivedBy")} value={record.receivedBy} />
      </CardContent>
    </Card>
  )
}
