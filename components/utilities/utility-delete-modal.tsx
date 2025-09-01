"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Utility } from "@/types/utility"

interface UtilityDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  utility: Utility | null
}

export function UtilityDeleteModal({ isOpen, onClose, onConfirm, utility }: UtilityDeleteModalProps) {
  const { t } = useLanguage()

  if (!utility) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t("utilities.deleteConfirmTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("utilities.deleteConfirmMessage")}</p>

          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">{utility.number}</p>
            <p className="text-sm text-muted-foreground">{utility.name}</p>
            <p className="text-sm text-muted-foreground">{utility.provider}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 justify-end">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            {t("utilities.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="flex-1 sm:flex-none">
            {t("utilities.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
