"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Warehouse } from "@/types/warehouse"

interface WarehouseDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  warehouse: Warehouse | null
}

export function WarehouseDeleteModal({ isOpen, onClose, onConfirm, warehouse }: WarehouseDeleteModalProps) {
  const { t } = useLanguage()

  if (!warehouse) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>{t("warehouse.deleteWarehouse")}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("warehouse.deleteConfirm")}</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{warehouse.name}</p>
            <p className="text-sm text-muted-foreground">{warehouse.location}</p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              {t("warehouse.cancel")}
            </Button>
            <Button variant="destructive" onClick={onConfirm} className="flex-1">
              {t("warehouse.delete")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
