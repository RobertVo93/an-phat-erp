"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { PayrollRecord } from "@/types/payroll"
import { useLanguage } from "@/contexts/language-context"

interface PayrollApproveProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  payrollRecord: PayrollRecord | null
}

export function PayrollApproveModal({ isOpen, onClose, onConfirm, payrollRecord }: PayrollApproveProps) {
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
          <DialogTitle>{t("payroll.processOne.title")}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">{t("payroll.processOne.message")}</p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{payrollRecord?.employee?.number} - {payrollRecord?.employee?.name!}</p>
            <p className="text-sm text-muted-foreground">
              {payrollRecord?.employee?.position || "N/A"} - {payrollRecord?.employee?.department || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">{payrollRecord.payPeriod}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("payroll.processOne.cancel")}
          </Button>
          <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleConfirm}>
            {t("payroll.processOne.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
