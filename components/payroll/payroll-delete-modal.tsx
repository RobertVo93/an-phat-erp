"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { PayrollRecord } from "@/types/payroll"
import { useLanguage } from "@/contexts/language-context"

interface PayrollDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  payrollRecord: PayrollRecord | null
}

export function PayrollDeleteModal({ isOpen, onClose, onConfirm, payrollRecord }: PayrollDeleteModalProps) {
  const { t } = useLanguage()

  if (!payrollRecord) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("payroll.delete.title")}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">{t("payroll.delete.message")}</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{payrollRecord.name}</p>
            <p className="text-sm text-muted-foreground">
              {payrollRecord.position} - {payrollRecord.department}
            </p>
            <p className="text-sm text-muted-foreground">{payrollRecord.payPeriod}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("payroll.delete.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {t("payroll.delete.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
