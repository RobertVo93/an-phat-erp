"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoneyInput } from "@/components/common/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatLargeCurrency, formatNumberWithCommas } from "@/lib/utils"
import type { IInvoiceUtilityUsage, TranslateFn, UtilityUsageUpdater } from "./types"

interface InvoiceUtilityReadingsSectionProps {
  t: TranslateFn
  rows: IInvoiceUtilityUsage[]
  usageGroups: IInvoiceUtilityUsage[]
  addRow: () => void
  updateRow: UtilityUsageUpdater
  removeRow: (index: number) => void
}

export function InvoiceUtilityReadingsSection({
  t,
  rows,
  usageGroups,
  addRow,
  updateRow,
  removeRow,
}: InvoiceUtilityReadingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("invoices.readings")}</CardTitle>
          <Button variant="outline" size="sm" onClick={addRow} className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            {t("production.form.add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row, index) => {
          const selectedGroup = usageGroups.find((item) => item.id === row.id)
          const usedKeys = rows
            .filter((_, i) => i !== index)
            .map((item) => item.id)
            .filter(Boolean)

          return (
            <div key={`${row.id || "usage-row"}-${index}`} className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">{t("invoices.utility")}</Label>
                  <Select value={row.id} onValueChange={(value) => updateRow(index, "id", value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={t("production.form.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {usageGroups
                        .filter((group) => group.id === row.id || !usedKeys.includes(group.id))
                        .map((group) => (
                          <SelectItem key={group.id} value={group.id!}>
                            {group.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.quantity")}</Label>
                  <Input value={formatNumberWithCommas(row.quantity || 0)} readOnly className="h-9" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.unitCost")}</Label>
                  <MoneyInput
                    id={`usage-unit-cost-${index}`}
                    value={row.unitCost}
                    onChange={(value) => updateRow(index, "unitCost", value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">{t("production.form.unit")}: </span>
                  <span className="font-medium">{selectedGroup?.unit || row.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                  <span className="font-medium">{formatLargeCurrency(row.totalCost || 0)}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={() => removeRow(index)} className="w-full text-red-600 text-xs">
                {t("production.form.remove")}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
