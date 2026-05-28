"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { InvoiceUtilities } from "@/components/invoices/InvoiceUtilities"
import { InvoiceBasicInfoSection } from "./invoice-form-modal/InvoiceBasicInfoSection"
import { InvoiceUtilityReadingsSection } from "./invoice-form-modal/InvoiceUtilityReadingsSection"
import { InvoiceSummarySection } from "./invoice-form-modal/InvoiceSummarySection"
import type { InvoiceFormModalProps } from "./invoice-form-modal/types"
import { useInvoiceForm } from "@/hooks/use-invoice-form"

export function InvoiceFormModal({ allUtilities, isOpen, invoice, mode, onClose, onSave }: InvoiceFormModalProps) {
  const { t } = useLanguage()
  const {
    formData,
    errors,
    utilityUsageRows,
    usageGroups,
    totals,
    setFormData,
    addUtility,
    updateUtility,
    removeUtility,
    addUtilityUsageRow,
    updateUtilityUsageRow,
    removeUtilityUsageRow,
    handleSubmit,
  } = useInvoiceForm({
    allUtilities,
    isOpen,
    invoice,
    mode,
    onSave,
    t,
  })
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("invoices.create") : t("invoices.edit")}</DialogTitle>
        </DialogHeader>

        <InvoiceBasicInfoSection t={t} formData={formData} setFormData={setFormData} errors={errors} />

        <Card>
          <CardContent className="pt-4">
            <InvoiceUtilities
              selectedUtilities={formData.utilities || []}
              availableUtilities={allUtilities}
              error={errors.utilities}
              addUtility={addUtility}
              updateUtility={updateUtility}
              removeUtility={removeUtility}
            />
          </CardContent>
        </Card>

        <InvoiceUtilityReadingsSection
          t={t}
          rows={utilityUsageRows}
          usageGroups={usageGroups}
          addRow={addUtilityUsageRow}
          updateRow={updateUtilityUsageRow}
          removeRow={removeUtilityUsageRow}
        />

        <InvoiceSummarySection t={t} formData={formData} setFormData={setFormData} totals={totals} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("invoices.notes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder={t("invoices.addNote")}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("invoices.form.cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("invoices.form.save")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
