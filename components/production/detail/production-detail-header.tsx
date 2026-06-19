"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ADMIN_ROUTES } from "@/constants"
import { useLanguage } from "@/contexts/language-context"
import { formatDate, getProductionStatusColor } from "@/lib/utils"
import type { IProductionDetail } from "@/types/production-detail"
import { ArrowLeft, Edit, Factory, PackageCheck } from "lucide-react"
import Link from "next/link"

interface IProductionDetailHeaderProps {
  record: IProductionDetail
  onEdit: () => void
}

export function ProductionDetailHeader({ record, onEdit }: IProductionDetailHeaderProps) {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-[linear-gradient(135deg,#064e3b_0%,#0f766e_48%,#fbbf24_140%)] p-5 text-white shadow-xl md:p-7">
      <div className="absolute right-0 top-0 h-44 w-44 translate-x-16 -translate-y-16 rounded-full bg-amber-200/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-24 w-72 translate-y-12 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm" className="w-fit bg-white/15 text-white hover:bg-white/25">
              <Link href={ADMIN_ROUTES.produce()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("common.back")}
              </Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="w-fit bg-amber-300 text-stone-950 hover:bg-amber-200"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </Button>
          </div>

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-50">
              <Factory className="h-4 w-4" />
              {t("production.history.sheetCode")}
            </p>
            <h1 className="flex flex-wrap items-center gap-3 text-3xl font-black tracking-tight md:text-5xl">
              <PackageCheck className="h-8 w-8 text-amber-200" />
              {record.number}
            </h1>
            <p className="max-w-2xl text-sm text-white/75 md:text-base">
              {record.product?.name || "-"} • {record.date ? formatDate(record.date) : "-"}
            </p>
          </div>
        </div>

        {record.status && (
          <Badge className={`${getProductionStatusColor(record.status)} border border-white/30 px-4 py-2 text-sm shadow-lg`}>
            {t(`production.history.${record.status}`)}
          </Badge>
        )}
      </div>
    </section>
  )
}
