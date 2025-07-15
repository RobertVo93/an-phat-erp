"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Download, Filter, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { ReportColumn } from "@/types/report-production"
import { ReportProductionFilterModal } from "@/components/modals/report-production-filter-modal"
import { useReportProduction } from "@/hooks/useReportProduction"
import { ReportViewBy, ReportViewType } from "@/types"
import ReportChart from "@/components/report-chart/report-chart"
import ReportTable from "@/components/report-table/report-table"

export default function EmployeeReportPage() {
  const { t } = useLanguage()

  const {
    loading,
    data,
    showFilterModal,
    filter,
    viewType,
    viewBy,
    activeProducts,
    setFilter,
    setShowFilterModal,
    setViewType,
    setViewBy
  } = useReportProduction()

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("pro.title")}</h2>
            <p className="text-muted-foreground">{t("pro.description")}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowFilterModal((prev) => !prev)}>
              <Filter className="mr-2 h-4 w-4" />
              {t("pro.filter")}
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t("pro.exportReport")}
            </Button>
          </div>
        </div>
      </div>

      {/* View Type & View By*/}
      <div className="mt-4 flex flex-col items-start gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={viewType === ReportViewType.table ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType(ReportViewType.table)}
          >
            {t(`pro.table`)}
          </Button>
          <Button
            variant={viewType === ReportViewType.chart ? "default" : "outline"}
            size="sm"
            onClick={() => setViewType(ReportViewType.chart)}
          >
            {t(`pro.chart`)}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewBy === ReportViewBy.daily ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewBy(ReportViewBy.daily)
              setFilter({})
            }}
          >
            {t(`pro.daily`)}
          </Button>
          <Button
            variant={viewBy === ReportViewBy.monthly ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewBy(ReportViewBy.monthly)
              setFilter({})
            }}
          >
            {t(`pro.monthly`)}
          </Button>
          <Button
            variant={viewBy === ReportViewBy.yearly ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewBy(ReportViewBy.yearly)
              setFilter({})
            }}
          >
            {t(`pro.yearly`)}
          </Button>

        </div>
      </div>

      {/* body */}
      <div className="mt-4">
        {viewType === ReportViewType.table ?
          <div className="">
            <ReportTable data={data}/>
          </div>
          :
          <div className="">
            <ReportChart />
          </div>
        }
      </div>

      {/* filter modal */}
      <ReportProductionFilterModal
        open={showFilterModal}
        currentFilter={filter}
        activeProducts={activeProducts}
        viewBy={viewBy}
        setCurrentFilter={setFilter}
        setShowFilterModal={setShowFilterModal}
      />
    </ERPLayout>
  )
}
