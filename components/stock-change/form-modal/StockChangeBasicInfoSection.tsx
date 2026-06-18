"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { useLanguage } from "@/contexts/language-context"
import { StockChangeStatus, StockChangeType } from "@/types"
import { IStockChangeBasicInfoSectionProps } from "./stock-change-form-types"

export function StockChangeBasicInfoSection({
  formData,
  errors,
  warehouses,
  setFormData,
  onStockTypeChange,
  onWarehouseChange,
}: IStockChangeBasicInfoSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="rounded-2xl border bg-white/95 p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="type">{t("stockIn.stockType")}</Label>
          <Select value={formData.type} onValueChange={onStockTypeChange}>
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder={t("stockIn.form.selectStockType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={StockChangeType.stockIn}>{t(`stockIn.form.${StockChangeType.stockIn}`)}</SelectItem>
              <SelectItem value={StockChangeType.stockOut}>{t(`stockIn.form.${StockChangeType.stockOut}`)}</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
        </div>

        <div>
          <Label htmlFor="date">{t("stockIn.date")}</Label>
          <Calendar
            selected={formData.date ? new Date(formData.date) : null}
            onChange={(value) => setFormData((prev) => ({ ...prev, date: value || undefined }))}
            showTimeSelect
            timeIntervals={15}
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
          />
        </div>

        <div>
          <Label htmlFor="status">{t("stockIn.status")}</Label>
          <Select
            value={formData.status}
            onValueChange={(value: StockChangeStatus) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(StockChangeStatus).map((status) => (
                <SelectItem key={status} value={status}>{t(`stockIn.status.${status}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="warehouse">{t("stockIn.warehouse")}</Label>
          <Select value={formData.warehouse?.id} onValueChange={onWarehouseChange}>
            <SelectTrigger className={errors.warehouse ? "border-red-500" : ""}>
              <SelectValue placeholder={t("stockIn.form.selectWarehouse")} />
            </SelectTrigger>
            <SelectContent>
              {warehouses.map((warehouse) => (
                warehouse.id ? (
                  <SelectItem key={warehouse.id} value={warehouse.id}>{warehouse.name}</SelectItem>
                ) : null
              ))}
            </SelectContent>
          </Select>
          {errors.warehouse && <p className="mt-1 text-sm text-red-500">{errors.warehouse}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="supplier">{t("stockIn.supplier")}</Label>
          <Input
            id="supplier"
            value={formData.supplier || ""}
            onChange={(event) => setFormData((prev) => ({ ...prev, supplier: event.target.value }))}
          />
          {errors.supplier && <p className="mt-1 text-sm text-red-500">{errors.supplier}</p>}
        </div>
      </div>
    </section>
  )
}
