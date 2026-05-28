"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import type { IUtilityUsage } from "@/types"

interface UtilityUsageDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  record: IUtilityUsage | null
  loading?: boolean
}

export function UtilityUsageDeleteModal({ isOpen, onClose, onConfirm, record, loading = false }: UtilityUsageDeleteModalProps) {
  const { t } = useLanguage()
  if (!record) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t("utilityUsage.deleteTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("utilityUsage.deleteMessage")}</p>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="font-medium">{record.number}</p>
            <p className="text-sm text-muted-foreground">{record.utility?.name}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>{t("common.cancel")}</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.delete")}
              </>
            ) : (
              t("common.confirm")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
