"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Send, Printer } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Invoice } from "@/types/invoice"
import { InvoiceStatus, ReadingType, UtilityType } from "@/types"

interface InvoiceViewModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  onDownload: (invoice: Invoice) => void
  onSend: (invoice: Invoice) => void
  onPrint: (invoice: Invoice) => void
}

export function InvoiceViewModal({ isOpen, onClose, invoice, onDownload, onSend, onPrint }: InvoiceViewModalProps) {
  const { t } = useLanguage()

  if (!invoice) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case InvoiceStatus.paid:
        return "bg-green-100 text-green-800"
      case InvoiceStatus.sent:
        return "bg-blue-100 text-blue-800"
      case InvoiceStatus.overdue:
        return "bg-red-100 text-red-800"
      case InvoiceStatus.draft:
        return "bg-gray-100 text-gray-800"
      case InvoiceStatus.cancelled:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case UtilityType.electricity:
        return "⚡"
      case UtilityType.water:
        return "💧"
      case UtilityType.gas:
        return "🔥"
      case UtilityType.internet:
        return "🌐"
      default:
        return "📋"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " ₫"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t("invoices.view")}</DialogTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onDownload(invoice)}>
              <Download className="h-4 w-4 mr-2" />
              {t("invoices.download")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onSend(invoice)}>
              <Send className="h-4 w-4 mr-2" />
              {t("invoices.send")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onPrint(invoice)}>
              <Printer className="h-4 w-4 mr-2" />
              {t("invoices.print")}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{invoice.invoiceNumber}</h2>
              <p className="text-muted-foreground">
                {t("invoices.billingPeriod")}: {
                  invoice.billingPeriod ?
                    new Date(invoice.billingPeriod).toLocaleDateString("sv-SE", { year: "numeric", month: "2-digit", }) :
                    ""
                }
              </p>
            </div>
            <Badge className={getStatusColor(invoice.status!)}>{t(`invoices.status.${invoice.status}`)}</Badge>
          </div>

          {/* Property & Tenant Info */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Thông tin căn hộ & người thuê</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">{invoice.propertyName}</h3>
                  <p className="text-sm text-muted-foreground">{invoice.propertyAddress}</p>
                </div>
                <div>
                  <p className="font-medium">{invoice.tenantName}</p>
                  <p className="text-sm text-muted-foreground">{invoice.tenantEmail}</p>
                  <p className="text-sm text-muted-foreground">{invoice.tenantPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t("invoices.detail")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">{t("invoices.issueDate")}</p>
                  <p className="font-medium">{formatDate(invoice.issueDate?.toString()!)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("invoices.dueDate")}</p>
                  <p className="font-medium">{formatDate(invoice.dueDate?.toString()!)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("invoices.status")}</p>
                  <Badge className={getStatusColor(invoice.status?.toString()!)}>{t(`invoices.status.${invoice.status}`)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utility Readings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("invoices.readings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoice.readings?.map((reading, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium flex items-center">
                        <span className="mr-2">{getUtilityIcon(reading.utilityType)}</span>
                        {reading.utilityName}
                      </h4>
                      <span className="font-medium">{formatCurrency(reading.total)}</span>
                    </div>

                    {reading.utilityType === ReadingType.predefined_utility ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mt-4">
                        <div>
                          <span className="block">{t("invoices.detail.consumption")}:</span>
                          <span className="font-medium">{reading.consumption}</span>
                        </div>
                        <div>
                          <span className="block">{t("invoices.unitPrice")}:</span>
                          <span className="font-medium">{formatCurrency(reading.unitPrice)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>{t("invoices.detail.fixedFee")}</span>
                        <span>{formatCurrency(reading.unitPrice)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>{t("invoices.detail.summary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("invoices.subtotal")}:</span>
                  <span>{formatCurrency(invoice.subtotal!)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t("invoices.tax")} ({invoice.taxRate}%):
                  </span>
                  <span>{formatCurrency(invoice.taxAmount!)}</span>
                </div>
                {invoice.otherFees! > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {t("invoices.otherFees")}
                      {invoice.otherFeesDescription && ` (${invoice.otherFeesDescription})`}:
                    </span>
                    <span>{formatCurrency(invoice.otherFees!)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t("invoices.total")}:</span>
                  <span>{formatCurrency(invoice.total!)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>{t("invoices.notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
