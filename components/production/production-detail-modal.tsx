import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency, formatDate, formatSystemNumber } from "@/lib/utils"
import type { ProductionRecord } from "@/types/production"
import { FormattedCurrency } from "../ui/formatted-currency"

interface ProductionDetailModalProps {
  record: ProductionRecord | null
  isOpen: boolean
  onClose: () => void
}

export function ProductionDetailModal({ record, isOpen, onClose }: ProductionDetailModalProps) {

  if (!record) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{record.number!}</DialogTitle>
        </DialogHeader>
        <ProductionDetailView record={record} />
      </DialogContent>
    </Dialog>
  )
}

function ProductionDetailView({ record }: { record: ProductionRecord }) {
  const { t } = useLanguage()

  const calculateTotalMaterialCost = () => {
    return record.materials?.reduce((sum, m) => sum + m.totalCost!, 0)
  };

  const calculateTotalUtilityCost = () => {
    return record.utilities?.reduce((sum, u) => sum + u.totalCost!, 0)
  };

  function calculateTotalSalary(): number {
    if (!Array.isArray(record?.labors)) return 0;

    return record?.labors.reduce((sum, labor) => {
      const salary = labor?.totalCost;
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
                {formatSystemNumber(record.quantity)} {t(`production.recordItem.${record.product?.unit}`)}
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

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.materials")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.materials?.map((material, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div className="truncate">
                    <div className="font-medium">{material?.name}</div>
                    <div className="text-xs text-gray-600">
                      {material.quantity} {t(`production.form.${material.unit}`)} x {formatCurrency(material.unitCost)}
                    </div>
                  </div>
                  <div className="text-right">
                    <FormattedCurrency as="div" className="font-bold" value={material.totalCost}/>
                  </div>
                </div>
              ))}
              {record.materials?.length === 0 && <div className="w-full flex justify-center">{t('common.noData')}</div>}
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
                  <div className="truncate">
                    <div className="font-medium">{utility?.name}</div>
                    <div className="text-xs text-gray-600">
                      {utility.quantity} {t(`production.form.${utility.unit}`)} x {formatCurrency(utility.unitCost)}
                    </div>
                  </div>
                  <div className="text-right">
                    <FormattedCurrency as="div" className="font-bold" value={utility.totalCost}/>
                  </div>
                </div>
              ))}
              {record.utilities?.length === 0 && <div className="w-full flex justify-center">{t('common.noData')}</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{t("production.detail.laborDetail")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {record.labors?.map((pl, ind) => (
                <div key={ind} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <div className="font-medium">{pl?.name} - {pl?.unit}</div>
                    <div className="text-xs text-gray-600">
                      {t("production.detail.salary")}: {formatCurrency(pl.totalCost)}
                    </div>
                  </div>
                </div>
              ))}
              {record.labors?.length === 0 && <div className="w-full flex justify-center">{t('common.noData')}</div>}
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
              <FormattedCurrency as="span" className="font-medium" value={calculateTotalMaterialCost()}/>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.utility")}:</span>
              <FormattedCurrency as="span" className="font-medium" value={calculateTotalUtilityCost()}/>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.labor")}:</span>
              <FormattedCurrency as="span" className="font-medium" value={calculateTotalSalary()}/>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">{t("production.detail.totalExpense")}:</span>
              <FormattedCurrency as="span" className="font-semibold" value={record.totalExpense}/>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.pricePerUnit")}:</span>
              <FormattedCurrency as="span" className="font-medium" value={Math.floor(record.totalExpense! / record.quantity!)}/>
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
              <FormattedCurrency as="span" className="font-medium" value={calculateRevenue()}/>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("production.detail.profit")}:</span>
              <FormattedCurrency as="span" className="font-medium" value={calculateProfit()}/>
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
