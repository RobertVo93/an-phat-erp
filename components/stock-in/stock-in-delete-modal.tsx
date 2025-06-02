"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { StockIn } from "@/types/stock-in"

interface StockInDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  stockIn: StockIn | null
}

export function StockInDeleteModal({ isOpen, onClose, onConfirm, stockIn }: StockInDeleteModalProps) {
  const { t } = useLanguage()

  if (!stockIn) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t("stockIn.delete.title")}
          </DialogTitle>
          <DialogDescription>{t("stockIn.delete.message")}</DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold">{stockIn.receiptNumber}</p>
          <p className="text-sm text-gray-600">{stockIn.supplierName}</p>
          <p className="text-sm text-gray-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(stockIn.totalAmount)}
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            {t("stockIn.form.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {t("stockIn.delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
