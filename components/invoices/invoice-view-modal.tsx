"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
          <DialogTitle>{invoice.number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <p className="text-muted-foreground">
              {t("invoices.billingPeriod")}: {invoice.billingPeriod}
            </p>
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

          {/* Utilities */}
          {(invoice.utilityUsages || []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("invoices.utility")}</CardTitle>
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
                        <span className="font-medium">{t(`production.form.${utility.unit}`)}</span>
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
          )}

          {/* Utility Readings */}
          {(invoice.utilityUsages || []).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("invoices.readings")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[34rem] overflow-y-auto pr-1">
                  {invoice.utilityUsages?.map((usage, index) => (
                    <div key={usage.id || index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{usage.name || usage.number || "-"}</h4>
                        <span className="font-medium">{formatLargeCurrency(usage.totalCost || 0)}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mt-4">
                        <div>
                          <span className="block">{t("invoices.detail.consumption")}:</span>
                          <span className="font-medium">{usage.quantity || 0}</span>
                        </div>
                        <div>
                          <span className="block">{t("utilities.unit")}:</span>
                          <span className="font-medium">{t(`production.form.${usage.unit}`)}</span>
                        </div>
                        <div>
                          <span className="block">{t("invoices.unitPrice")}:</span>
                          <span className="font-medium">{formatLargeCurrency(usage.unitCost || 0)}</span>
                        </div>
                        <div>
                          <span className="block">{t("invoices.number")}:</span>
                          <span className="font-medium">{usage.number || "-"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
