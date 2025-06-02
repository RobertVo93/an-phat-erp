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

interface InvoiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => void
  invoice?: Invoice
  mode: "create" | "edit"
}

export function InvoiceFormModal({ isOpen, onClose, onSave, invoice, mode }: InvoiceFormModalProps) {
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    propertyId: "",
    propertyName: "",
    propertyAddress: "",
    tenantName: "",
    tenantPhone: "",
    tenantEmail: "",
    billingPeriod: "",
    issueDate: "",
    dueDate: "",
    readings: [] as UtilityReading[],
    taxRate: 5,
    otherFees: 0,
    otherFeesDescription: "",
    status: "draft" as const,
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (invoice && mode === "edit") {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        propertyId: invoice.propertyId,
        propertyName: invoice.propertyName,
        propertyAddress: invoice.propertyAddress,
        tenantName: invoice.tenantName,
        tenantPhone: invoice.tenantPhone,
        tenantEmail: invoice.tenantEmail,
        billingPeriod: invoice.billingPeriod,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        readings: invoice.readings,
        taxRate: invoice.taxRate,
        otherFees: invoice.otherFees,
        otherFeesDescription: invoice.otherFeesDescription,
        status: invoice.status,
        notes: invoice.notes,
      })
    } else {
      // Reset form for create mode
      const today = new Date().toISOString().split("T")[0]
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 15)

      // Get current month/year for billing period
      const currentDate = new Date()
      const month = String(currentDate.getMonth() + 1).padStart(2, "0")
      const year = currentDate.getFullYear()
      const billingPeriod = `${month}/${year}`

      setFormData({
        invoiceNumber: `UTL-${Date.now()}`,
        propertyId: "",
        propertyName: "",
        propertyAddress: "",
        tenantName: "",
        tenantPhone: "",
        tenantEmail: "",
        billingPeriod: billingPeriod,
        issueDate: today,
        dueDate: dueDate.toISOString().split("T")[0],
        readings: [],
        taxRate: 5,
        otherFees: 0,
        otherFeesDescription: "",
        status: "draft",
        notes: "",
      })
    }
    setErrors({})
  }, [invoice, mode, isOpen])

  const calculateTotals = () => {
    const subtotal = formData.readings.reduce((sum, reading) => sum + reading.total, 0)
    const taxAmount = (subtotal * formData.taxRate) / 100
    const total = subtotal + taxAmount + formData.otherFees

    return {
      subtotal,
      taxAmount,
      total,
    }
  }

  const addReading = () => {
    const newReading: UtilityReading = {
      id: `reading-${Date.now()}`,
      utilityType: "electricity",
      utilityName: t("invoices.electricity"),
      previousReading: 0,
      currentReading: 0,
      consumption: 0,
      unitPrice: 0,
      total: 0,
    }
    setFormData((prev) => ({
      ...prev,
      readings: [...prev.readings, newReading],
    }))
  }

  const updateReading = (index: number, field: keyof UtilityReading, value: string | number) => {
    const updatedReadings = [...formData.readings]

    if (field === "utilityType") {
      // Update utility name based on type
      const utilityType = value as "electricity" | "water" | "gas" | "internet" | "other"
      updatedReadings[index] = {
        ...updatedReadings[index],
        [field]: utilityType,
        utilityName: t(`invoices.${utilityType}`),
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
      if (reading.utilityType === "internet" || reading.utilityType === "other") {
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
      readings: prev.readings.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = t("invoices.form.required")
    }
    if (!formData.propertyName.trim()) {
      newErrors.propertyName = t("invoices.form.required")
    }
    if (!formData.tenantName.trim()) {
      newErrors.tenantName = t("invoices.form.required")
    }
    if (!formData.billingPeriod.trim()) {
      newErrors.billingPeriod = t("invoices.form.required")
    }
    if (!formData.issueDate) {
      newErrors.issueDate = t("invoices.form.required")
    }
    if (!formData.dueDate) {
      newErrors.dueDate = t("invoices.form.required")
    }
    if (formData.readings.length === 0) {
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
              <CardTitle className="text-lg">Thông tin hóa đơn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="invoiceNumber">{t("invoices.invoiceNumber")}</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                    className={errors.invoiceNumber ? "border-red-500" : ""}
                  />
                  {errors.invoiceNumber && <p className="text-sm text-red-500 mt-1">{errors.invoiceNumber}</p>}
                </div>

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
                      <SelectItem value="draft">{t("invoices.status.draft")}</SelectItem>
                      <SelectItem value="sent">{t("invoices.status.sent")}</SelectItem>
                      <SelectItem value="paid">{t("invoices.status.paid")}</SelectItem>
                      <SelectItem value="partial">{t("invoices.status.partial")}</SelectItem>
                      <SelectItem value="overdue">{t("invoices.status.overdue")}</SelectItem>
                      <SelectItem value="cancelled">{t("invoices.status.cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="billingPeriod">{t("invoices.billingPeriod")}</Label>
                  <Input
                    id="billingPeriod"
                    value={formData.billingPeriod}
                    onChange={(e) => setFormData((prev) => ({ ...prev, billingPeriod: e.target.value }))}
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
                    value={formData.issueDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
                    className={errors.issueDate ? "border-red-500" : ""}
                  />
                  {errors.issueDate && <p className="text-sm text-red-500 mt-1">{errors.issueDate}</p>}
                </div>

                <div>
                  <Label htmlFor="dueDate">{t("invoices.dueDate")}</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className={errors.dueDate ? "border-red-500" : ""}
                  />
                  {errors.dueDate && <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property & Tenant Info */}
          <Card>
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
          </Card>

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
                {formData.readings.map((reading, index) => (
                  <div key={reading.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Tiện ích {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeReading(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>{t("invoices.utilityType")}</Label>
                        <Select
                          value={reading.utilityType}
                          onValueChange={(value) => updateReading(index, "utilityType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electricity">{t("invoices.electricity")}</SelectItem>
                            <SelectItem value="water">{t("invoices.water")}</SelectItem>
                            <SelectItem value="gas">{t("invoices.gas")}</SelectItem>
                            <SelectItem value="internet">{t("invoices.internet")}</SelectItem>
                            <SelectItem value="other">{t("invoices.other")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>{t("invoices.utilityName")}</Label>
                        <Input
                          value={reading.utilityName}
                          onChange={(e) => updateReading(index, "utilityName", e.target.value)}
                        />
                      </div>

                      {(reading.utilityType === "electricity" ||
                        reading.utilityType === "water" ||
                        reading.utilityType === "gas") && (
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
                      )}

                      <div>
                        <Label>{t("invoices.consumption")}</Label>
                        <Input
                          type="number"
                          min="0"
                          value={reading.consumption}
                          readOnly={reading.utilityType !== "other"}
                          onChange={(e) => updateReading(index, "consumption", Number.parseInt(e.target.value) || 0)}
                          className={reading.utilityType !== "other" ? "bg-gray-50" : ""}
                        />
                      </div>

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
              <CardTitle className="text-lg">Tổng kết</CardTitle>
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
                  <span>{totals.subtotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t("invoices.tax")} ({formData.taxRate}%):
                  </span>
                  <span>{totals.taxAmount.toLocaleString("vi-VN")} ₫</span>
                </div>
                {formData.otherFees > 0 && (
                  <div className="flex justify-between">
                    <span>{t("invoices.otherFees")}:</span>
                    <span>{formData.otherFees.toLocaleString("vi-VN")} ₫</span>
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
                placeholder="Ghi chú thêm..."
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
