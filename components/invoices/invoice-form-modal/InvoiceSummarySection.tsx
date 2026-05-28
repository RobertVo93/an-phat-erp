"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoneyInput } from "@/components/common/input"
import { formatLargeCurrency } from "@/lib/utils"
import type { FormUpdater, IInvoiceFormData, IInvoiceTotals, TranslateFn } from "./types"

interface InvoiceSummarySectionProps {
  t: TranslateFn
  formData: IInvoiceFormData
  setFormData: FormUpdater
  totals: IInvoiceTotals
}

export function InvoiceSummarySection({ t, formData, setFormData, totals }: InvoiceSummarySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("invoices.detail.summary")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="taxRate">{t("invoices.tax")} (%)</Label>
            <Input
              id="taxRate"
              type="number"
              min="0"
              max="100"
              readOnly
              value={formData.taxRate}
              onChange={(e) => setFormData((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <div>
            <Label htmlFor="otherFees">{t("invoices.otherFees")}</Label>
            <MoneyInput id="otherFees" value={formData.otherFees} onChange={(e) => setFormData((prev) => ({ ...prev, otherFees: e }))} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="otherFeesDescription">{t("invoices.otherFeesDescription")}</Label>
            <Input
              id="otherFeesDescription"
              value={formData.otherFeesDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, otherFeesDescription: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-6 space-y-2 text-right">
          <div className="flex justify-between">
            <span>{t("invoices.subtotal")}:</span>
            <span>{formatLargeCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t("invoices.utility")}:</span>
            <span>{formatLargeCurrency(totals.utilitySubtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t("invoices.readings")}:</span>
            <span>{formatLargeCurrency(totals.usageSubtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("invoices.tax")} ({formData.taxRate}%):</span>
            <span>{formatLargeCurrency(totals.taxAmount)}</span>
          </div>
          {(formData.otherFees || 0) > 0 && (
            <div className="flex justify-between">
              <span>{t("invoices.otherFees")}:</span>
              <span>{formatLargeCurrency(formData.otherFees || 0)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>{t("invoices.total")}:</span>
            <span>{formatLargeCurrency(totals.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
