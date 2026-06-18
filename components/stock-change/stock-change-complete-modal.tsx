"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { StockChange } from "@/types/stock-change"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { StockChangeStatus } from "@/types"
import { FormattedCurrency } from "@/components/ui/formatted-currency"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (stockChange: Omit<StockChange, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  stockChange: StockChange | null
  loading: boolean
}

export function StockChangeCompleteModal({ isOpen, onClose, onSave, stockChange, loading }: Props) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<StockChange | null>(stockChange ?? null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (isComplete: boolean) => {
    const newErrors: Record<string, string> = {}

    if (isComplete) {
      if (!(formData?.receivedBy?.trim())) {
        newErrors.receivedBy = t("stockIn.validation.receivedByRequired")
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (isComplete: boolean) => {
    if (!validateForm(isComplete || formData?.status === StockChangeStatus.completed)) return

    let submitData = { ...formData }
    if (isComplete) {
      submitData.status = StockChangeStatus.completed
    }
    const success = await onSave(submitData)
    if (success) {
      onClose()
    }
  }

  useEffect(() => {
    setFormData(stockChange ?? null)
  }, [stockChange, isOpen])

  if (!stockChange) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            {t("stockIn.form.autoComplete")}
          </DialogTitle>
          <DialogDescription>{t("stockIn.autoComplete.message")}</DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold">{stockChange.number}</p>
          <p className="text-sm text-gray-600">{stockChange.supplier}</p>
          <FormattedCurrency as="span" className="text-sm text-gray-600" value={stockChange.totalAmount}/>
        </div>

        <div>
          <Label htmlFor="receivedBy">{t("stockIn.receivedBy")}</Label>
          <Input
            id="receivedBy"
            className={errors.receivedBy ? "border-red-500" : ""}
            value={formData?.receivedBy}
            onChange={(e) => setFormData((prev) => ({ ...prev, receivedBy: e.target.value }))}
          />
          {errors.receivedBy && <p className="text-sm text-red-500 mt-1">{errors.receivedBy}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            {t("stockIn.form.cancel")}
          </Button>
          <Button variant="outline" className="bg-green-500 hover:bg-green-600 transition-all duration-300" onClick={() => handleSave(true)}>
            {t("stockIn.form.completeNow")} {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
