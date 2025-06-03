"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { Collection } from "@/types/collection"
import { useLanguage } from "@/contexts/language-context"

interface CollectionDeleteModalProps {
  collection: Collection | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function CollectionDeleteModal({ collection, open, onOpenChange, onConfirm }: CollectionDeleteModalProps) {
  const { t } = useLanguage()
  if (!collection) return null

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t("collections.deleteCollection")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t("collections.deleteConfirmation")} <strong>"{collection.name}"</strong>
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              ⚠️ {t("collections.deleteWarning")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            {t("collections.deleteCollection")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
