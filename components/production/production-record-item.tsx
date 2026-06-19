"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Edit, Eye } from "lucide-react"
import type { ProductionRecord } from "@/types/production"
import { useLanguage } from "@/contexts/language-context"
import { ProductionStatus } from "@/types"
import { formatCurrency, formatDate, formatSystemNumber, getProductionStatusColor } from "@/lib/utils"
import Link from "next/link"
import { ADMIN_ROUTES } from "@/constants"
import { FormattedCurrency } from "../ui/formatted-currency"

interface ProductionRecordItemProps {
  record: ProductionRecord
  onView: (record: ProductionRecord) => void
  onEdit: (record: ProductionRecord) => void
}

export function ProductionRecordItem({ record, onView, onEdit }: ProductionRecordItemProps) {
  const { t } = useLanguage()
  const detailId = record.number || record.id || ""

  const calculateLabor = () => {
    return record.labors?.reduce((sum, l) => sum + l.totalCost!, 0)
  }

  return (
    <div className="border rounded-lg p-3 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="w-full flex items-start gap-3 sm:gap-4">
          <div className="flex-1">
            <Link
              href={ADMIN_ROUTES.produceDetail(detailId)}
              className="font-semibold text-sm sm:text-base text-emerald-700 underline-offset-4 hover:underline"
            >
              {record.number}
            </Link>
            <h3 className="font-semibold">
              {record.product?.name}
            </h3>
            <h3 className="text-xs text-gray-600">
              {formatSystemNumber(record.quantity)} {t(`production.recordItem.${record.product?.unit}`)}
            </h3>
            <h3 className="text-xs text-gray-600">
              {formatDate(record.date!)}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <Badge className={getProductionStatusColor(record.status!)}>
              {record.status === ProductionStatus.completed ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <Clock className="w-3 h-3 mr-1" />
              )}
              {t(`production.recordItem.${record.status}`)}
            </Badge>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => onView(record)}>
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden lg:inline">{t("production.recordItem.seeDetails")}</span>
              </Button>
              <Button variant="outline" size="sm" className={`text-xs ${record.status === ProductionStatus.completed && 'hidden'}`} onClick={() => onEdit(record)}>
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden lg:inline">{t("production.recordItem.edit")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-8 sm:h-10">
          <TabsTrigger value="materials" className="text-xs sm:text-sm">
            {t("production.recordItem.materialsShort")}
          </TabsTrigger>
          <TabsTrigger value="utilities" className="text-xs sm:text-sm">
            {t("production.recordItem.utilitiesShort")}
          </TabsTrigger>
          <TabsTrigger value="labor" className="text-xs sm:text-sm">
            {t("production.recordItem.laborShort")}
          </TabsTrigger>
          <TabsTrigger value="summary" className="text-xs sm:text-sm">
            {t("production.recordItem.summaryShort")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-2 mt-3">
          {record.materials?.map((material, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs sm:text-sm">
              <span className="font-medium">{material?.name}</span>
              <div className="text-right">
                <div>
                  {formatSystemNumber(material.quantity)} {t(`production.recordItem.${material?.unit}`)} x {formatCurrency(material.unitCost!)} 
                </div>
                <FormattedCurrency as="div" className="text-xs text-gray-600 font-bold" value={material.totalCost}/>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="utilities" className="space-y-2 mt-3">
          {record?.utilities?.map((utility, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs sm:text-sm">
              <span className="font-medium">{utility?.name!}</span>
              <div className="text-right">
                <div>
                  {formatSystemNumber(utility.quantity)} {t(`production.form.${utility?.unit}`)} x {formatCurrency(utility.unitCost!)} 
                </div>
                <FormattedCurrency as="div" className="text-xs text-gray-600 font-bold" value={utility.totalCost}/>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="labor" className="space-y-2 mt-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 bg-gray-50 rounded">
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{formatSystemNumber(record.labors?.length!)} {t("production.recordItem.person")}</div>
              <div className="text-xs text-gray-600">{t("production.recordItem.labors")}</div>
            </div>
            <div className="text-center">
              <FormattedCurrency as="div" className="font-medium text-sm sm:text-base" value={calculateLabor()}/>
              <div className="text-xs text-gray-600">{t("production.recordItem.laborExpenses")}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-2 mt-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 bg-gray-50 rounded">
            <div className="text-center">
              <FormattedCurrency as="div" className="font-medium text-sm sm:text-base" value={record.totalExpense}/>
              <div className="text-xs text-gray-600">{t("production.recordItem.totalExpense")}</div>
            </div>
            <div className="text-center">
              <FormattedCurrency as="div" className="font-medium text-sm sm:text-base" value={record.totalCost}/>
              <div className="text-xs text-gray-600">{t("production.history.totalRevenue")}</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
