"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import type { IInvoiceUtility, Invoice } from "@/types/invoice"
import { InvoiceStatus, Utility, UtilityUnit } from "@/types"
import { MutationMode } from "@/types/base.interface"
import { UIDatePicker } from "@/components/ui/datepicker"
import { formatLargeCurrency, formatMonthYear } from "@/lib/utils"
import { env } from "@/constants/env"
import { MoneyInput } from "@/components/common/input"
import { InvoiceUtilities } from "@/components/invoices/InvoiceUtilities"

interface InvoiceFormModalProps {
  isOpen: boolean
  invoice?: Invoice
  mode: MutationMode
  allUtilities: Utility[]
  onClose: () => void
  onSave: (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => void
}

const defaultInvoice: Invoice & { billingPeriodDate: Date } = {
  billingPeriod: formatMonthYear(new Date()),
  billingPeriodDate: new Date(),
  issueDate: new Date(),
  dueDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  })(),
  subtotal: 0,
  taxRate: env.NEXT_PUBLIC_TAX_RATE,
  taxAmount: 0,
  otherFees: 0,
  otherFeesDescription: '',
  total: 0,
  status: InvoiceStatus.draft,
  notes: "",
  utilities: [],
}

export function InvoiceFormModal({ allUtilities, isOpen, invoice, mode, onClose, onSave }: InvoiceFormModalProps) {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<Invoice & { billingPeriodDate?: Date }>(defaultInvoice)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (invoice && mode === "update") {
      const billingPeriodSplit = invoice.billingPeriod?.split("-")
      setFormData({
        ...invoice,
        billingPeriodDate: new Date(billingPeriodSplit![1] as any, (billingPeriodSplit![0] as any) - 1, 1)
      })
    } else {
      setFormData(defaultInvoice)
    }
    setErrors({})
  }, [invoice, mode, isOpen, allUtilities])

  const calculateTotals = useCallback(() => {
    const subtotal = formData.utilities?.reduce((sum, utility) => {
      return sum + utility.totalCost!;
    }, 0);
    const taxAmount = (subtotal! * formData.taxRate!) / 100
    const total = subtotal! + taxAmount + formData.otherFees!

    return {
      subtotal,
      taxAmount,
      total,
    }
  }, [formData])

  const addUtility = () => {
    const newUtility: IInvoiceUtility = {
      id: "",
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      name: "",
      unit: UtilityUnit.other,
      number: "",
    }
    setFormData((prev) => ({
      ...prev,
      utilities: [...prev.utilities!, newUtility],
    }))
  }
  const updateUtility = (index: number, field: string, value: any) => {
    const updated = [...(formData.utilities || [])]
    if (field === "id") {
      const utility = allUtilities.find((m) => m.id === value)
      if (utility) {
        updated[index] = {
          ...updated[index],
          quantity: 1,
          id: utility.id,
          totalCost: utility.costPerUnit,
          name: utility.name,
          unit: utility.unit,
          number: utility.number,
          unitCost: utility.costPerUnit
        }
      }
    } else if (field === "quantity") {
      updated[index].quantity = Number(value) || 0
      updated[index].totalCost = updated[index].quantity! * updated[index].unitCost!
    }
    else if (field === "unitCost") {
      updated[index].unitCost = Number(value) || 0
      updated[index].totalCost = updated[index].quantity! * updated[index].unitCost!
    }
    setFormData({ ...formData, utilities: updated })
  }
  const removeUtility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      utilities: prev.utilities?.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.billingPeriod) {
      newErrors.billingPeriod = t("invoices.form.required")
    }
    if (!formData.issueDate) {
      newErrors.issueDate = t("invoices.form.required")
    }
    if (!formData.dueDate) {
      newErrors.dueDate = t("invoices.form.required")
    }
    if (formData.utilities?.length === 0) {
      newErrors.utilities = t("invoices.form.required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const totals = useMemo(() => calculateTotals(), [formData])

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return
    const invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      billingPeriod: formatMonthYear(formData.billingPeriodDate!),
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total
    }

    onSave(invoiceData)
  }, [formData, totals])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("invoices.create") : t("invoices.edit")}</DialogTitle>
        </DialogHeader>

        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("invoices.utilityInformation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">{t("invoices.status")}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(InvoiceStatus).map((status) => {
                      return (
                        <SelectItem key={status} value={status}>{t(`invoices.status.${status}`)}</SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="billingPeriod">{t("invoices.billingPeriod")}</Label>
                <UIDatePicker
                  selected={formData.billingPeriodDate!}
                  onChange={(date) => setFormData((prev) => ({ ...prev, billingPeriodDate: date! }))}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  className={errors.billingPeriod ? "border-red-500" : ""}
                  showIcon
                />
                {errors.billingPeriod && <p className="text-sm text-red-500 mt-1">{errors.billingPeriod}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="issueDate">{t("invoices.issueDate")}</Label>
                <UIDatePicker
                  selected={formData.issueDate!}
                  onChange={(date) => setFormData((prev) => ({ ...prev, issueDate: date! }))}
                  dateFormat="yyyy-MM-dd"
                  className={errors.issueDate ? "border-red-500" : ""}
                  showIcon
                />
                {errors.issueDate && <p className="text-sm text-red-500 mt-1">{errors.issueDate}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="dueDate">{t("invoices.dueDate")}</Label>
                <UIDatePicker
                  selected={formData.dueDate!}
                  onChange={(date) => setFormData((prev) => ({ ...prev, dueDate: date! }))}
                  dateFormat="yyyy-MM-dd"
                  className={errors.dueDate ? "border-red-500" : ""}
                  showIcon
                />
                {errors.dueDate && <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Utilities */}
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

        {/* Totals */}
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="otherFees">{t("invoices.otherFees")}</Label>
                <MoneyInput
                  id="otherFees"
                  value={formData.otherFees}
                  onChange={(e) => setFormData((prev) => ({ ...prev, otherFees: e }))}
                />
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
                <span>{formatLargeCurrency(totals.subtotal!)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {t("invoices.tax")} ({formData.taxRate}%):
                </span>
                <span>{formatLargeCurrency(totals.taxAmount)}</span>
              </div>
              {formData.otherFees! > 0 && (
                <div className="flex justify-between">
                  <span>{t("invoices.otherFees")}:</span>
                  <span>{formatLargeCurrency(formData.otherFees!)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>{t("invoices.total")}:</span>
                <span>{formatLargeCurrency(totals.total!)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
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

        {/* Actions */}
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
