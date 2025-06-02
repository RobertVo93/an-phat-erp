"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { StockOut } from "@/types/stock-out"
import { useLanguage } from "@/contexts/language-context"

interface StockOutViewModalProps {
  isOpen: boolean
  onClose: () => void
  stockOut: StockOut | null
}

export function StockOutViewModal({ isOpen, onClose, stockOut }: StockOutViewModalProps) {
  const { t } = useLanguage()

  if (!stockOut) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
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
          <DialogTitle className="flex items-center justify-between">
            <span>{t("stockOut.viewStockOut")}</span>
            <Badge className={getStatusColor(stockOut.status)}>{t(`stockOut.status.${stockOut.status}`)}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("common.basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.receiptNumber")}</span>
                  <p className="font-medium">{stockOut.receiptNumber}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("common.date")}</span>
                  <p>{formatDate(stockOut.date)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.warehouse")}</span>
                  <p>{stockOut.warehouseName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.processedBy")}</span>
                  <p>{stockOut.processedBy || t("common.notAssigned")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("stockOut.customer")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.customerName")}</span>
                  <p className="font-medium">{stockOut.customerName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.customerPhone")}</span>
                  <p>{stockOut.customerPhone}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.customerAddress")}</span>
                  <p>{stockOut.customerAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("common.shipping")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.shippingMethod")}</span>
                  <p>{stockOut.shippingMethod}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.trackingNumber")}</span>
                  <p>{stockOut.trackingNumber || t("common.notAssigned")}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">{t("stockOut.orderReference")}</span>
                  <p>{stockOut.orderReference || t("common.notAvailable")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("stockOut.products")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockOut.products.map((product, index) => (
                  <div key={product.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{product.productName}</h4>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                      <Badge variant="outline">
                        {t("stockOut.availableStock")}: {product.availableStock}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t("common.quantity")}: </span>
                        <span className="font-medium">{product.quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("common.unitPrice")}: </span>
                        <span className="font-medium">{formatCurrency(product.unitPrice)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t("common.total")}: </span>
                        <span className="font-medium">{formatCurrency(product.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("common.financialSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("common.subtotal")}:</span>
                  <span>{formatCurrency(stockOut.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t("common.discount")}
                    {stockOut.discountType === "percentage" ? ` (${stockOut.discount}%)` : ""}:
                  </span>
                  <span>
                    -
                    {formatCurrency(
                      stockOut.discountType === "percentage"
                        ? (stockOut.subtotal * stockOut.discount) / 100
                        : stockOut.discount,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("common.tax")} (10%):</span>
                  <span>{formatCurrency(stockOut.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("common.total")}:</span>
                  <span>{formatCurrency(stockOut.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {stockOut.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("common.notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{stockOut.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("common.timestamps")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("common.createdAt")}: </span>
                  <span>{new Date(stockOut.createdAt).toLocaleString("vi-VN")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("common.updatedAt")}: </span>
                  <span>{new Date(stockOut.updatedAt).toLocaleString("vi-VN")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
