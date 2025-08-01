"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Employee } from "@/types/employee"
import { useLanguage } from "@/contexts/language-context"
import { AlertTriangle } from "lucide-react"

interface EmployeeDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  employee: Employee | null
}

export function EmployeeDeleteModal({ isOpen, onClose, onConfirm, employee }: EmployeeDeleteModalProps) {
  const { t } = useLanguage()

  if (!employee) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>{t("employees.delete.title")}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">{t("employees.delete.message")}</p>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium">{employee.name}</p>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
            <p className="text-sm text-muted-foreground">{employee.department}</p>
            <p className="text-sm text-muted-foreground">ID: {employee.number}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("employees.delete.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("employees.delete.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
