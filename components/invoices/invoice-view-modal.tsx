"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Send, Printer } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Invoice } from "@/types/invoice"
import { formatDate, formatLargeCurrency, getInvoiceStatusColor } from "@/lib/utils"

interface InvoiceViewModalProps {
  isOpen: boolean
  invoice: Invoice | null
  onClose: () => void
  onDownload: (invoice: Invoice) => void
  onSend: (invoice: Invoice) => void
  onPrint: (invoice: Invoice) => void
}

export function InvoiceViewModal({ isOpen, invoice, onClose, onDownload, onSend, onPrint }: InvoiceViewModalProps) {
  const { t } = useLanguage()

  if (!invoice) return null

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
              <h2 className="text-2xl font-bold">{invoice.number}</h2>
              <p className="text-muted-foreground">
                {t("invoices.billingPeriod")}: {invoice.billingPeriod}
              </p>
            </div>
          </div>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t("invoices.detail")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">{t("invoices.issueDate")}</p>
                  <p className="font-medium">{formatDate(invoice.issueDate!)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("invoices.dueDate")}</p>
                  <p className="font-medium">{formatDate(invoice.dueDate!)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("invoices.status")}</p>
                  <Badge className={getInvoiceStatusColor(invoice.status!)}>{t(`invoices.status.${invoice.status}`)}</Badge>
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
                {invoice.utilities?.map((utility, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium flex items-center">
                        {utility.name}
                      </h4>
                      <span className="font-medium">{formatLargeCurrency(utility.totalCost!)}</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mt-4">
                      <div>
                        <span className="block">{t("invoices.detail.consumption")}:</span>
                        <span className="font-medium">{utility.quantity}</span>
                      </div>
                      <div>
                        <span className="block">{t("utilities.unit")}:</span>
                        <span className="font-medium">{utility.unit}</span>
                      </div>
                      <div>
                        <span className="block">{t("invoices.unitPrice")}:</span>
                        <span className="font-medium">{formatLargeCurrency(utility.unitCost!)}</span>
                      </div>
                    </div>
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
                  <span>{formatLargeCurrency(invoice.subtotal!)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t("invoices.tax")} ({invoice.taxRate}%):
                  </span>
                  <span>{formatLargeCurrency(invoice.taxAmount!)}</span>
                </div>
                {invoice.otherFees! > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {t("invoices.otherFees")}
                      {invoice.otherFeesDescription && ` (${invoice.otherFeesDescription})`}:
                    </span>
                    <span>{formatLargeCurrency(invoice.otherFees!)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t("invoices.total")}:</span>
                  <span>{formatLargeCurrency(invoice.total!)}</span>
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
