"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Invoice, UtilityReading } from "@/types/invoice"
import { InvoiceStatus, ReadingType, Utility, UtilityType } from "@/types"

interface InvoiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => void
  invoice?: Invoice
  mode: "create" | "edit"
  allUtilities: Utility[]
}

export function InvoiceFormModal({ allUtilities, isOpen, onClose, onSave, invoice, mode }: InvoiceFormModalProps) {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<Invoice>({
    invoiceNumber: "",
    billingPeriod: new Date(),
    issueDate: new Date(),
    dueDate: new Date(),
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    otherFees: 0,
    otherFeesDescription: '',
    total: 0,
    paidAmount: 0,
    status: InvoiceStatus.draft,
    notes: "",
    readings: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (invoice && mode === "edit") {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        billingPeriod: invoice.billingPeriod,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        taxAmount: invoice.taxAmount,
        otherFees: invoice.otherFees,
        otherFeesDescription: invoice.otherFeesDescription,
        total: invoice.total,
        paidAmount: invoice.paidAmount,
        status: invoice.status,
        notes: invoice.notes,
        readings: invoice.readings,
      })
    } else {
      setFormData({
        billingPeriod: new Date(),
        issueDate: new Date(),
        dueDate: new Date(),
        subtotal: 0,
        taxRate: 0,
        taxAmount: 0,
        otherFees: 0,
        otherFeesDescription: '',
        total: 0,
        paidAmount: 0,
        status: InvoiceStatus.draft,
        notes: "",
        readings: []
      })
    }
    setErrors({})
  }, [invoice, mode, isOpen, allUtilities])

  const calculateTotals = () => {
    const subtotal = formData.readings?.reduce((sum, reading) => sum + reading.total, 0)
    const taxAmount = (subtotal! * formData.taxRate!) / 100
    const total = subtotal! + taxAmount + formData.otherFees!

    return {
      subtotal,
      taxAmount,
      total,
    }
  }

  const addReading = () => {
    const newReading: UtilityReading = {
      id: "",
      utilityType: ReadingType.other,
      utilityName: "",
      previousReading: 0,
      currentReading: 0,
      consumption: 0,
      unitPrice: 0,
      total: 0,
      utility: undefined,
    }
    setFormData((prev) => ({
      ...prev,
      readings: [...prev.readings!, newReading],
    }))
  }

  const updateReading = (index: number, field: keyof UtilityReading, value: string | number) => {
    const updatedReadings = [...formData.readings!]

    if (field === "utilityType") {
      updatedReadings[index] = {
        ...updatedReadings[index],
        utilityType: value as ReadingType,
      }
    } else if (field === "utilityName") {
      const selectedUtility = allUtilities.find((ult) => ult.id === value.toString())
      updatedReadings[index] = {
        ...updatedReadings[index],
        utilityName: selectedUtility ? selectedUtility.name! : value.toString() ,
        utility: selectedUtility ? selectedUtility : undefined
      }
    } else {
      updatedReadings[index] = {
        ...updatedReadings[index],
        [field]: value,
      }
    }

    // Recalculate consumption and total if readings or unit price change
    if (field === "previousReading" || field === "currentReading" || field === "unitPrice") {
      const reading = updatedReadings[index]

      // For utility types that don't use meter readings (like internet)
      if (reading.utilityType === UtilityType.other.toString()) {
        updatedReadings[index].consumption = 1
        updatedReadings[index].total = reading.unitPrice
      } else {
        // Calculate consumption based on readings
        const consumption = Math.max(0, reading.currentReading - reading.previousReading)
        updatedReadings[index].consumption = consumption
        updatedReadings[index].total = consumption * reading.unitPrice
      }
    }

    setFormData((prev) => ({
      ...prev,
      readings: updatedReadings,
    }))
  }

  const removeReading = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      readings: prev.readings?.filter((_, i) => i !== index),
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
    if (formData.readings?.length === 0) {
      newErrors.readings = t("invoices.form.required")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const totals = calculateTotals()

    const invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
      paidAmount: mode === "create" ? 0 : invoice?.paidAmount || 0,
    }

    onSave(invoiceData)
    onClose()
  }

  const totals = calculateTotals()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("invoices.create") : t("invoices.edit")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                      <SelectItem value={InvoiceStatus.draft}>{t("invoices.status.draft")}</SelectItem>
                      <SelectItem value={InvoiceStatus.sent}>{t("invoices.status.sent")}</SelectItem>
                      <SelectItem value={InvoiceStatus.paid}>{t("invoices.status.paid")}</SelectItem>
                      <SelectItem value={InvoiceStatus.partial}>{t("invoices.status.partial")}</SelectItem>
                      <SelectItem value={InvoiceStatus.overdue}>{t("invoices.status.overdue")}</SelectItem>
                      <SelectItem value={InvoiceStatus.cancelled}>{t("invoices.status.cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="billingPeriod">{t("invoices.billingPeriod")}</Label>
                  <Input
                    id="billingPeriod"
                    type="month"
                    value={formData.billingPeriod
                      ? new Date(formData.billingPeriod).toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                      })
                      : ""}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split("-");
                      const date = new Date(Number(year), Number(month) - 1);
                      setFormData((prev) => ({ ...prev, billingPeriod: date }));
                    }}
                    placeholder="MM/YYYY"
                    className={errors.billingPeriod ? "border-red-500" : ""}
                  />
                  {errors.billingPeriod && <p className="text-sm text-red-500 mt-1">{errors.billingPeriod}</p>}
                </div>

                <div>
                  <Label htmlFor="issueDate">{t("invoices.issueDate")}</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={new Date(formData.issueDate!).toLocaleDateString("sv-SE")}
                    onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: new Date(e.target.value) }))}
                    className={errors.issueDate ? "border-red-500" : ""}
                  />
                  {errors.issueDate && <p className="text-sm text-red-500 mt-1">{errors.issueDate}</p>}
                </div>

                <div>
                  <Label htmlFor="dueDate">{t("invoices.dueDate")}</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={new Date(formData.dueDate!).toLocaleDateString("sv-SE")}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: new Date(e.target.value) }))}
                    className={errors.dueDate ? "border-red-500" : ""}
                  />
                  {errors.dueDate && <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property & Tenant Info */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin căn hộ & người thuê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="propertyName">{t("invoices.propertyName")}</Label>
                  <Input
                    id="propertyName"
                    value={formData.propertyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, propertyName: e.target.value }))}
                    className={errors.propertyName ? "border-red-500" : ""}
                  />
                  {errors.propertyName && <p className="text-sm text-red-500 mt-1">{errors.propertyName}</p>}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="propertyAddress">{t("invoices.propertyAddress")}</Label>
                  <Input
                    id="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, propertyAddress: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="tenantName">{t("invoices.tenantName")}</Label>
                  <Input
                    id="tenantName"
                    value={formData.tenantName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tenantName: e.target.value }))}
                    className={errors.tenantName ? "border-red-500" : ""}
                  />
                  {errors.tenantName && <p className="text-sm text-red-500 mt-1">{errors.tenantName}</p>}
                </div>

                <div>
                  <Label htmlFor="tenantPhone">{t("invoices.tenantPhone")}</Label>
                  <Input
                    id="tenantPhone"
                    value={formData.tenantPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tenantPhone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="tenantEmail">{t("invoices.tenantEmail")}</Label>
                  <Input
                    id="tenantEmail"
                    type="email"
                    value={formData.tenantEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tenantEmail: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Utility Readings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t("invoices.readings")}</CardTitle>
              <Button type="button" onClick={addReading} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("invoices.addReading")}
              </Button>
            </CardHeader>
            <CardContent>
              {errors.readings && <p className="text-sm text-red-500 mb-4">{errors.readings}</p>}

              <div className="space-y-4">
                {formData.readings?.map((reading, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">{t("invoices.utility")} {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeReading(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Select utility type: pre-defined utility or other (free text) */}
                      <div>
                        <Label>{t("invoices.utilityType")}</Label>
                        <Select
                          value={reading.utilityType}
                          onValueChange={(value) => updateReading(index, "utilityType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue defaultValue={t("invoices.other")} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(ReadingType).map((type, index) => (
                              <SelectItem key={index} value={type}>{t(`invoices.${type}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* if pre-defined */}
                      {reading.utilityType === ReadingType.predefined_utility &&
                        <div>
                          <Label>{t("invoices.utility")}</Label>
                          <Select
                            value={reading.utility?.id}
                            onValueChange={(value) => updateReading(index, "utilityName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {allUtilities.map((ult, ind) => (
                                <SelectItem key={ind} value={ult.id!}>{ult.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      }

                      {/* if free text utility */}
                      {reading.utilityType === ReadingType.other &&
                        <div>
                          <Label>{t("invoices.utilityName")}</Label>
                          <Input
                            value={reading.utilityName}
                            onChange={(e) => updateReading(index, "utilityName", e.target.value)}
                          />
                        </div>
                      }

                      {!(reading.utilityType === UtilityType.other.toString()) &&
                        <>
                          <div>
                            <Label>{t("invoices.previousReading")}</Label>
                            <Input
                              type="number"
                              min="0"
                              value={reading.previousReading}
                              onChange={(e) =>
                                updateReading(index, "previousReading", Number.parseInt(e.target.value) || 0)
                              }
                            />
                          </div>

                          <div>
                            <Label>{t("invoices.currentReading")}</Label>
                            <Input
                              type="number"
                              min="0"
                              value={reading.currentReading}
                              onChange={(e) =>
                                updateReading(index, "currentReading", Number.parseInt(e.target.value) || 0)
                              }
                            />
                          </div>
                        </>
                      }

                      {!(reading.utilityType === UtilityType.other.toString()) &&
                        <div className={``}>
                          <Label>{t("invoices.consumption")}</Label>
                          <Input
                            type="number"
                            min="0"
                            readOnly={true}
                            value={reading.consumption}
                            onChange={(e) => updateReading(index, "consumption", Number.parseInt(e.target.value) || 0)}
                          />
                        </div>}

                      <div>
                        <Label>{t("invoices.unitPrice")}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={reading.unitPrice}
                          onChange={(e) => updateReading(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label>{t("invoices.total")}</Label>
                        <Input value={reading.total.toLocaleString("vi-VN")} readOnly className="bg-gray-50" />
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
                    value={formData.taxRate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="otherFees">{t("invoices.otherFees")}</Label>
                  <Input
                    id="otherFees"
                    type="number"
                    min="0"
                    value={formData.otherFees}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, otherFees: Number.parseFloat(e.target.value) || 0 }))
                    }
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
                  <span>{totals.subtotal?.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t("invoices.tax")} ({formData.taxRate}%):
                  </span>
                  <span>{totals.taxAmount.toLocaleString("vi-VN")} ₫</span>
                </div>
                {formData.otherFees! > 0 && (
                  <div className="flex justify-between">
                    <span>{t("invoices.otherFees")}:</span>
                    <span>{formData.otherFees?.toLocaleString("vi-VN")} ₫</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t("invoices.total")}:</span>
                  <span>{totals.total.toLocaleString("vi-VN")} ₫</span>
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
            <Button type="submit">{t("invoices.form.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
