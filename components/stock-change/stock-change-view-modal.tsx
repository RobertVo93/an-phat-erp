"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, User, MapPin, FileText, Hash } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { StockChange } from "@/types/stock-change"
import { StockChangeStatus } from "@/types"

interface StockChangeViewModalProps {
  isOpen: boolean
  onClose: () => void
  stockChange: StockChange | null
}

export function StockChangeViewModal({ isOpen, onClose, stockChange }: StockChangeViewModalProps) {
  const { t } = useLanguage()

  if (!stockChange) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case StockChangeStatus.completed:
        return "bg-green-100 text-green-800"
      case StockChangeStatus.pending:
        return "bg-yellow-100 text-yellow-800"
      case StockChangeStatus.inTransit:
        return "bg-blue-100 text-blue-800"
      case StockChangeStatus.cancelled:
        return "bg-red-100 text-red-800"
      case StockChangeStatus.draft:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t("stockIn.view")} - {stockChange.receiptNumber}
            </DialogTitle>
            <Badge className={getStatusColor(stockChange.status!)}>{t(`stockIn.status.${stockChange.status}`)}</Badge>
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
                      <p className="text-sm text-gray-500">{t("stockIn.receiptNumber")}</p>
                      <p className="font-semibold">{stockChange.receiptNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.date")}</p>
                      <p className="font-semibold">{formatDate(`${stockChange.date}`)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.supplier")}</p>
                      <p className="font-semibold">{stockChange.supplier}</p>
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

                  {stockChange.referenceNumber && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">{t("stockIn.reference")}</p>
                        <p className="font-semibold">{stockChange.referenceNumber}</p>
                      </div>
                    </div>
                  )}

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
                    <div className="md:col-span-1">
                      <h4 className="font-semibold">{item.product?.name}</h4>
                      <p className="text-sm text-gray-500">{item.product?.sku}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t("stockIn.form.quantity")}</p>
                      <p className="font-semibold">{item.quantity!.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t("stockIn.form.unitCost")}</p>
                      <p className="font-semibold">{formatCurrency(item.unitCost!)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t("stockIn.form.totalCost")}</p>
                      <p className="font-semibold">{formatCurrency(item.unitCost! * item.quantity!)}</p>
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
                  <span className="font-semibold">{formatCurrency(stockChange.subtotal!)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("stockIn.form.tax")}:</span>
                  <span className="font-semibold">{formatCurrency(stockChange.tax!)}</span>
                </div>
                {stockChange.discount! > 0 && (
                  <div className="flex justify-between">
                    <span>{t("stockIn.form.discount")}:</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(stockChange.discount!)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>{t("stockIn.totalAmount")}:</span>
                  <span>{formatCurrency(stockChange.totalAmount!)}</span>
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
