"use client"

import { endOfMonth } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { InvoiceStatus } from "@/types"
import type { ErrorMap, FormUpdater, IInvoiceFormData, TranslateFn } from "./types"

interface InvoiceBasicInfoSectionProps {
  t: TranslateFn
  formData: IInvoiceFormData
  setFormData: FormUpdater
  errors: ErrorMap
}

export function InvoiceBasicInfoSection({ t, formData, setFormData, errors }: InvoiceBasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("invoices.utilityInformation")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">{t("invoices.status")}</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as InvoiceStatus }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(InvoiceStatus).map((status) => (
                  <SelectItem key={status} value={status}>{t(`invoices.status.${status}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="billingPeriod">{t("invoices.billingPeriod")}</Label>
            <Calendar
              selected={formData.billingPeriodDate!}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  billingPeriodDate: date!,
                  dueDate: endOfMonth(date!),
                  utilityUsages: [],
                }))
              }
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className={errors.billingPeriod ? "border-red-500" : ""}
              showIcon
            />
            {errors.billingPeriod && <p className="text-sm text-red-500 mt-1">{errors.billingPeriod}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="issueDate">{t("invoices.issueDate")}</Label>
            <Calendar
              selected={formData.issueDate!}
              onChange={(date) => setFormData((prev) => ({ ...prev, issueDate: date! }))}
              className={errors.issueDate ? "border-red-500" : ""}
              showIcon
            />
            {errors.issueDate && <p className="text-sm text-red-500 mt-1">{errors.issueDate}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="dueDate">{t("invoices.dueDate")}</Label>
            <Calendar
              selected={formData.dueDate!}
              onChange={(date) => setFormData((prev) => ({ ...prev, dueDate: date! }))}
              className={errors.dueDate ? "border-red-500" : ""}
              showIcon
            />
            {errors.dueDate && <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
