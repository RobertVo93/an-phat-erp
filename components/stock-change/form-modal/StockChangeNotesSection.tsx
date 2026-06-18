"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { IStockChangeNotesSectionProps } from "./stock-change-form-types"

export function StockChangeNotesSection({ formData, errors, setFormData }: IStockChangeNotesSectionProps) {
  const { t } = useLanguage()

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Label htmlFor="notes">{t("stockIn.notes")}</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
          rows={3}
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="receivedBy">{t("stockIn.receivedBy")}</Label>
        <Input
          id="receivedBy"
          className={errors.receivedBy ? "border-red-500" : ""}
          value={formData.receivedBy || ""}
          onChange={(event) => setFormData((prev) => ({ ...prev, receivedBy: event.target.value }))}
        />
        {errors.receivedBy && <p className="mt-1 text-sm text-red-500">{errors.receivedBy}</p>}
      </div>
    </section>
  )
}
