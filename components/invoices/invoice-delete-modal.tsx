"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { Invoice } from "@/types/invoice"
import { formatLargeCurrency } from "@/lib/utils"

interface InvoiceDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  invoice: Invoice | null
}

export function InvoiceDeleteModal({ isOpen, onClose, onConfirm, invoice }: InvoiceDeleteModalProps) {
  const { t } = useLanguage()

  if (!invoice) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>{t("invoices.delete.title")}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("invoices.delete.message")}</p>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{invoice.number}</p>
            <p className="font-medium">{invoice.billingPeriod}</p>
            <p className="text-sm text-muted-foreground">{formatLargeCurrency(invoice.total!)}</p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              {t("invoices.form.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              {t("invoices.delete.confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
