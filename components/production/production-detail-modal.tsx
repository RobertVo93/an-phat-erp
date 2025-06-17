import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { formatDate } from "@/lib/utils"
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
          <DialogTitle>{t("production.detail.title")} - {record.id}</DialogTitle>
          <DialogDescription>{t("production.detail.description")} {record.product?.description}</DialogDescription>
        </DialogHeader>
        <ProductionDetailView record={record} />
      </DialogContent>
    </Dialog>
  )
}

function ProductionDetailView({ record }: { record: ProductionRecord }) {
  const { t } = useLanguage() 
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                {record.quantity} {record.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.date")}:</span>
              <span className="font-medium">{formatDate(record.date!)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.shift")}:</span>
              <span className="font-medium">{record.shift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.operator")}:</span>
              <span className="font-medium">{record.operator}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.expenseSummary")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.materials")}:</span>
              <span className="font-medium">
                {record.productionMaterials?.reduce((sum, m) => sum + m.totalCost!, 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiện ích:</span>
              <span className="font-medium">
                {record.utilities?.reduce((sum, u) => sum + u.cost!, 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.labors")}:</span>
              <span className="font-medium">{record.labor?.cost!.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">{t("production.detail.totalExpense")}:</span>
              <span className="font-semibold">{record.totalCost!.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.expensePerKilo")}:</span>
              <span className="font-medium">{(record.totalCost! / record.quantity!).toFixed(0).toLocaleString()} đ</span>
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
                    <div className="font-medium">{material.material?.cost!.toLocaleString()} đ</div>
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
              {record.utilities!.map((utility, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <div className="font-medium">{utility.name}</div>
                    <div className="text-xs text-gray-600">
                      {utility.quantity} {utility.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{utility.cost?.toLocaleString()} đ</div>
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
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded">
                <div className="text-lg sm:text-xl font-bold">{record.labor!.hours} {t("production.detail.hour")}</div>
                <div className="text-xs text-gray-600">{t("production.detail.totalWorkingHour")}</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded">
                <div className="text-lg sm:text-xl font-bold">{record.labor!.workers} {t("production.detail.person")}</div>
                <div className="text-xs text-gray-600">{t("production.detail.laborsQuantity")}</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded">
                <div className="text-lg sm:text-xl font-bold">{record.labor?.cost!.toLocaleString()} đ</div>
                <div className="text-xs text-gray-600">{t("production.detail.laborsExpenses")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
