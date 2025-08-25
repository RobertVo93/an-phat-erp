"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Edit, Eye } from "lucide-react"
import type { ProductionRecord } from "@/types/production"
import { useLanguage } from "@/contexts/language-context"
import { ProductionStatus } from "@/types"
import { formatDate, formatLargeCurrency, getProductionStatusColor } from "@/lib/utils"

interface ProductionRecordItemProps {
  record: ProductionRecord
  onView: (record: ProductionRecord) => void
  onEdit: (record: ProductionRecord) => void
}

export function ProductionRecordItem({ record, onView, onEdit }: ProductionRecordItemProps) {
  const { t } = useLanguage()

  const calculateLabor = () => {
    return record.labors?.reduce((sum, l) => sum + l.totalCost!, 0)
  }

  return (
    <div className="border rounded-lg p-3 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-sm sm:text-base">{record.product?.name}</h3>
            <h3 className="text-xs text-gray-600">
              {record.quantity?.toLocaleString()} {t(`production.recordItem.${record.product?.unit}`)}
            </h3>
            <h3 className="text-xs text-gray-600">
              {formatDate(record.date!)}
            </h3>
          </div>
          <Badge className={getProductionStatusColor(record.status!)}>
            {record.status === ProductionStatus.completed ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {t(`production.recordItem.${record.status}`)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(record)} className="text-xs">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">{t("production.recordItem.seeDetails")}</span>
            <span className="sm:hidden">{t("production.recordItem.see")}</span>
          </Button>
          <Button variant="outline" size="sm" className={`text-xs ${record.status === ProductionStatus.completed && 'hidden'}`} onClick={() => onEdit(record)}>
            <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">{t("production.recordItem.edit")}</span>
            <span className="sm:hidden">{t("production.recordItem.edit")}</span>
          </Button>
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
                  {material.quantity?.toLocaleString()} {t(`production.recordItem.${material?.unit}`)} x {formatLargeCurrency(material.unitCost!)} 
                </div>
                <div className="text-xs text-gray-600">{formatLargeCurrency(material.totalCost!)}</div>
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
                  {utility.quantity} {t(`production.form.${utility?.unit}`)} x {formatLargeCurrency(utility.unitCost!)} 
                </div>
                <div className="text-xs text-gray-600">{formatLargeCurrency(utility.totalCost!)}</div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="labor" className="space-y-2 mt-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 p-2 bg-gray-50 rounded">
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{record.labors?.length!} {t("production.recordItem.person")}</div>
              <div className="text-xs text-gray-600">{t("production.recordItem.labors")}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{formatLargeCurrency(calculateLabor()!)}</div>
              <div className="text-xs text-gray-600">{t("production.recordItem.laborExpenses")}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-2 mt-3">
          <div className="grid grid-cols-1 gap-2 sm:gap-4 p-2 bg-gray-50 rounded">
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{formatLargeCurrency(record.totalCost!)}</div>
              <div className="text-xs text-gray-600">{t("production.recordItem.totalExpense")}</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
