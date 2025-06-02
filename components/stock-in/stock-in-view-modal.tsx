"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, User, MapPin, FileText, Hash } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { StockIn } from "@/types/stock-in"

interface StockInViewModalProps {
  isOpen: boolean
  onClose: () => void
  stockIn: StockIn | null
}

export function StockInViewModal({ isOpen, onClose, stockIn }: StockInViewModalProps) {
  const { t } = useLanguage()

  if (!stockIn) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "draft":
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
              {t("stockIn.view")} - {stockIn.receiptNumber}
            </DialogTitle>
            <Badge className={getStatusColor(stockIn.status)}>{t(`stockIn.status.${stockIn.status}`)}</Badge>
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
                      <p className="font-semibold">{stockIn.receiptNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.date")}</p>
                      <p className="font-semibold">{formatDate(stockIn.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.supplier")}</p>
                      <p className="font-semibold">{stockIn.supplierName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.warehouse")}</p>
                      <p className="font-semibold">{stockIn.warehouseName}</p>
                    </div>
                  </div>

                  {stockIn.referenceNumber && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">{t("stockIn.reference")}</p>
                        <p className="font-semibold">{stockIn.referenceNumber}</p>
                      </div>
                    </div>
                  )}

                  {stockIn.receivedBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">{t("stockIn.receivedBy")}</p>
                        <p className="font-semibold">{stockIn.receivedBy}</p>
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
                {stockIn.items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <h4 className="font-semibold">{item.productName}</h4>
                        <p className="text-sm text-gray-500">{item.productSku}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">{t("stockIn.form.quantity")}</p>
                        <p className="font-semibold">{item.quantity.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">{t("stockIn.form.unitCost")}</p>
                        <p className="font-semibold">{formatCurrency(item.unitCost)}</p>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{t("stockIn.form.totalCost")}</span>
                      <span className="font-bold text-lg">{formatCurrency(item.totalCost)}</span>
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
                  <span className="font-semibold">{formatCurrency(stockIn.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("stockIn.form.tax")}:</span>
                  <span className="font-semibold">{formatCurrency(stockIn.tax)}</span>
                </div>
                {stockIn.discount > 0 && (
                  <div className="flex justify-between">
                    <span>{t("stockIn.form.discount")}:</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(stockIn.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>{t("stockIn.totalAmount")}:</span>
                  <span>{formatCurrency(stockIn.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {stockIn.notes && (
            <Card>
              <CardHeader>
                <CardTitle>{t("stockIn.notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{stockIn.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
