"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface PayrollProcessAllProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function PayrollProcessAllModal({ isOpen, onClose, onConfirm }: PayrollProcessAllProps) {
  const { t } = useLanguage()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("payroll.processAll.title")}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">{t("payroll.processAll.message")}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("payroll.processAll.cancel")}
          </Button>
          <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleConfirm}>
            {t("payroll.processAll.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
