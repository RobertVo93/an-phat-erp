"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Customer } from "@/types/customer"
import { useLanguage } from "@/contexts/language-context"

import { AlertTriangle } from "lucide-react"

interface CustomerDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  customer: Customer | null
}

export function CustomerDeleteModal({ isOpen, onClose, onConfirm, customer }: CustomerDeleteModalProps) {
  const { t } = useLanguage()

  if (!customer) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>{t("customers.delete.title")}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">{t("customers.delete.message")}</p>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("customers.delete.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("customers.delete.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
