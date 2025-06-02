"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { StockOut } from "@/types/stock-out"
import { useLanguage } from "@/contexts/language-context"

interface StockOutDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  stockOut: StockOut | null
}

export function StockOutDeleteModal({ isOpen, onClose, onConfirm, stockOut }: StockOutDeleteModalProps) {
  const { t } = useLanguage()

  if (!stockOut) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>{t("stockOut.deleteStockOut")}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>{t("stockOut.confirmDelete")}</p>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <div>
                <strong>{t("stockOut.receiptNumber")}:</strong> {stockOut.receiptNumber}
              </div>
              <div>
                <strong>{t("stockOut.customer")}:</strong> {stockOut.customerName}
              </div>
              <div>
                <strong>{t("common.total")}:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(stockOut.totalAmount)}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t("stockOut.deleteWarning")}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
