"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, User, MapPin, Warehouse, Hash } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { StockChange } from "@/types/stock-change"
import { formatDateTime, getStockChangeStatusColor } from "@/lib/utils"
import { env } from "@/constants/env"
import { FormattedNumber } from "@/components/ui/formatted-number"
import { FormattedCurrency } from "@/components/ui/formatted-currency"

interface StockChangeViewModalProps {
  isOpen: boolean
  onClose: () => void
  stockChange: StockChange | null
}

export function StockChangeViewModal({ isOpen, onClose, stockChange }: StockChangeViewModalProps) {
  const { t } = useLanguage()

  if (!stockChange) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t("stockIn.view")} - {stockChange.number}
            </DialogTitle>
            <Badge className={getStockChangeStatusColor(stockChange.status!)}>{t(`stockIn.status.${stockChange.status}`)}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("stockIn.form.title.view")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.stockType")}</p>
                      <p className="font-semibold">{t(`stockIn.form.${stockChange.type}`)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.date")}</p>
                      <p className="font-semibold">{formatDateTime(`${stockChange.date}`)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.warehouse")}</p>
                      <p className="font-semibold">{stockChange.warehouse?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.supplier")}</p>
                      <p className="font-semibold">{stockChange.supplier}</p>
                    </div>
                  </div>

                  {stockChange.receivedBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">{t("stockIn.receivedBy")}</p>
                        <p className="font-semibold">{stockChange.receivedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("stockIn.products")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockChange.stockProducts && stockChange.stockProducts.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.sku}</p>
                    </div>
                    <div className="grid grid-cols-2 md:col-span-2">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">{t("stockIn.form.quantity")}</p>
                        <FormattedNumber as="span" className="font-semibold" value={item.quantity} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">{t("stockIn.form.unitCost")}</p>
                        <FormattedNumber as="span" className="font-semibold" value={item.unitCost} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t("stockIn.form.totalCost")}</p>
                      <FormattedCurrency as="span" className="font-semibold" value={item.unitCost! * item.quantity!} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>{t("stockIn.totalAmount")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{t("stockIn.form.subtotal")}:</span>
                  <FormattedCurrency as="span" className="font-semibold" value={stockChange.subtotal} />
                </div>
                {
                  env.NEXT_PUBLIC_TAX_RATE > 0 && (
                    <div className="flex justify-between">
                      <span>{t("stockIn.form.tax")} ({env.NEXT_PUBLIC_TAX_RATE}%) :</span>
                      <FormattedCurrency as="span" className="font-semibold" value={stockChange.tax} />
                    </div>
                  )
                }
                <div className="flex justify-between">
                  <span>{t("stockIn.form.discount")}:</span>
                  <FormattedCurrency as="span" className="font-semibold text-red-600" value={stockChange.discount} />
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>{t("stockIn.totalAmount")}:</span>
                  <FormattedCurrency as="span" value={stockChange.totalAmount} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {stockChange.notes && (
            <Card>
              <CardHeader>
                <CardTitle>{t("stockIn.notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{stockChange.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
