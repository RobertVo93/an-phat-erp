"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { IProductionReportPeriodLabelsV2 } from "@/types/report-production-v2.interface"
import { AlertCircle, ChartNoAxesColumnIncreasing, type LucideIcon } from "lucide-react"
import { ReactNode } from "react"

export type ProductionChartToneV2 = "blue" | "orange" | "emerald" | "slate"

interface IProductionChartFrameV2Props {
  title: string
  description: string
  periodLabels: IProductionReportPeriodLabelsV2
  loading: boolean
  hasData: boolean
  hasError: boolean
  tone?: ProductionChartToneV2
  emptyTitle?: string
  emptyDescription?: string
  children: ReactNode
}

const HEADER_TONE_CLASSES: Record<ProductionChartToneV2, string> = {
  blue: "from-slate-50 via-white to-blue-50/50",
  orange: "from-slate-50 via-white to-orange-50/60",
  emerald: "from-slate-50 via-white to-emerald-50/60",
  slate: "from-slate-50 via-white to-slate-100/70",
}

export function ProductionChartFrameV2({
  title,
  description,
  periodLabels,
  loading,
  hasData,
  hasError,
  tone = "blue",
  emptyTitle,
  emptyDescription,
  children,
}: IProductionChartFrameV2Props) {
  const { t } = useLanguage()

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader
        className={cn(
          "gap-4 border-b bg-gradient-to-r sm:flex-row sm:items-start sm:justify-between",
          HEADER_TONE_CLASSES[tone],
        )}
      >
        <div className="space-y-1.5">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="grid shrink-0 grid-cols-1 gap-1.5 text-xs text-muted-foreground sm:text-right">
          <span>
            {t("rp.page.currentPeriod")}: {" "}
            <strong className="font-semibold text-blue-700">{periodLabels.current}</strong>
          </span>
          <span>
            {t("rp.page.samePeriodLastYear")}: {" "}
            <strong className="font-semibold text-orange-700">{periodLabels.previous}</strong>
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-6 sm:p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[360px] w-full rounded-xl" />
            <div className="flex justify-center gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : hasError ? (
          <ChartMessage
            icon={AlertCircle}
            title={t("rp.v2.loadError")}
            description={t("rp.v2.loadErrorDescription")}
          />
        ) : !hasData ? (
          <ChartMessage
            icon={ChartNoAxesColumnIncreasing}
            title={emptyTitle ?? t("rp.v2.noData")}
            description={emptyDescription ?? t("rp.v2.noDataDescription")}
          />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

interface IChartMessageProps {
  icon: LucideIcon
  title: string
  description: string
}

function ChartMessage({ icon: Icon, title, description }: IChartMessageProps) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/70 px-6 text-center">
      <div className="mb-4 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200">
        <Icon className="h-6 w-6 text-slate-500" aria-hidden="true" />
      </div>
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
