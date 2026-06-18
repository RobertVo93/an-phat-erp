"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { StockChangeStatus } from "@/types"
import { IStockChangeActionsProps } from "./stock-change-form-types"

export function StockChangeFormActions({ status, loading, onClose, onSave }: IStockChangeActionsProps) {
  const { t } = useLanguage()

  return (
    <div className="sticky bottom-0 -mx-1 flex justify-end gap-3 border-t bg-background/95 px-1 py-4 backdrop-blur">
      <Button variant="outline" type="button" onClick={onClose}>
        {t("stockIn.form.cancel")}
      </Button>
      {status !== StockChangeStatus.completed && (
        <Button type="button" onClick={() => onSave(true)} disabled={loading}>
          {t("stockIn.form.autoComplete")}
          {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      )}
      <Button type="button" onClick={() => onSave(false)} disabled={loading}>
        {t("stockIn.form.save")}
        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
      </Button>
    </div>
  )
}
