import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { formatDate } from "@/lib/utils"
import { UtilityUnit } from "@/types"
import type { ProductionRecord } from "@/types/production"

interface ProductionDetailModalProps {
  record: ProductionRecord | null
  isOpen: boolean
  onClose: () => void
}

export function ProductionDetailModal({ record, isOpen, onClose }: ProductionDetailModalProps) {
  const { t } = useLanguage()

  if (!record) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("production.detail.title")} - {record.productionNumber!}</DialogTitle>
          <DialogDescription>{t("production.detail.description")} {record.product?.description}</DialogDescription>
        </DialogHeader>
        <ProductionDetailView record={record} />
      </DialogContent>
    </Dialog>
  )
}

function ProductionDetailView({ record }: { record: ProductionRecord }) {
  const { t } = useLanguage()

  const calculateTotalMaterialCost = () => {
    return record.productionMaterials?.reduce((sum, m) => sum + m.totalCost!, 0)
  };

  const calculateTotalUtilityCost = () => {
    return record.productionUtilities?.reduce((sum, u) => sum + u.totalCost!, 0)
  };

  function calculateTotalSalary(): number {
    if (!Array.isArray(record?.productionLabors)) return 0;

    return record?.productionLabors.reduce((sum, labor) => {
      const salary = labor?.employee?.salary;
      return sum + (typeof salary === "number" ? salary : 0);
    }, 0);
  }

  const calculateRevenue = () => {
    return record.product?.price! * record.quantity!
  };

  const calculateProfit = () => {
    const totalCost = calculateTotalMaterialCost()! + calculateTotalUtilityCost()! + calculateTotalSalary()!
    return record.product?.price! * record.quantity! - totalCost
  }

  const calculateEfficiency = () => {
    const totalCost = calculateTotalMaterialCost()! + calculateTotalUtilityCost()! + calculateTotalSalary()!
    const totalIncome = record.product?.price! * record?.quantity!
    const efficiency = ((totalIncome! - totalCost) / totalIncome!) * 100  // ((total income - total expense) / total income) * 100
    return efficiency
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.productionInformation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.product")}:</span>
              <span className="font-medium">{record.product?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.quantity")}:</span>
              <span className="font-medium">
                {record.quantity} {t(`production.recordItem.${record.product?.unit}`)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.date")}:</span>
              <span className="font-medium">{formatDate(record.date!)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.warehouse")}:</span>
              <span className="font-medium">{record.warehouse?.name}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.materials")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.productionMaterials?.map((material, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <div className="font-medium">{material.material?.name}</div>
                    <div className="text-xs text-gray-600">
                      {material.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{material.totalCost!.toLocaleString()} đ</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.utility")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.productionUtilities!.map((utility, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <div className="font-medium">{utility.utility?.name}</div>
                    <div className="text-xs text-gray-600">
                      {utility.quantity} {utility.utility?.unit === UtilityUnit.other ? t("production.detail.other") : utility.utility?.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{utility.totalCost?.toLocaleString()} đ</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.laborDetail")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {record.productionLabors?.map((pl, ind) => (
                <div key={ind} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <div className="font-medium">{pl.employee?.name} - {pl.employee?.position}</div>
                    <div className="text-xs text-gray-600">
                      {t("production.detail.salary")}: {pl.totalCost?.toLocaleString()} đ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.expenseSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.materials")}:</span>
              <span className="font-medium">
                {calculateTotalMaterialCost()?.toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.utility")}:</span>
              <span className="font-medium">
                {calculateTotalUtilityCost()?.toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.labor")}:</span>
              <span className="font-medium">
                {calculateTotalSalary().toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">{t("production.detail.totalExpense")}:</span>
              <span className="font-semibold">{record.totalCost!.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.pricePerUnit")}:</span>
              <span className="font-medium">
                {(record.totalCost! / record.quantity!).toLocaleString()} đ
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.revenueSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.revenue")}:</span>
              <span className="font-medium">
                {calculateRevenue().toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.profit")}:</span>
              <span className="font-medium">
                {calculateProfit().toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.efficiency")}:</span>
              <span className="font-medium">
                {calculateEfficiency().toLocaleString()} %
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
