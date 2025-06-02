"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PayrollRecord } from "@/types/payroll"
import { useLanguage } from "@/contexts/language-context"

interface PayrollViewModalProps {
  isOpen: boolean
  onClose: () => void
  payrollRecord: PayrollRecord | null
}

export function PayrollViewModal({ isOpen, onClose, payrollRecord }: PayrollViewModalProps) {
  const { t } = useLanguage()

  if (!payrollRecord) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("payroll.viewPayroll")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt={payrollRecord.name} />
              <AvatarFallback className="text-lg">{getInitials(payrollRecord.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold">{payrollRecord.name}</h3>
                <Badge className={getStatusColor(payrollRecord.status)}>
                  {t(`payroll.status.${payrollRecord.status.toLowerCase()}`)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {payrollRecord.position} - {t(`payroll.departments.${payrollRecord.department.toLowerCase()}`)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("payroll.form.employeeId")}: {payrollRecord.employeeId}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payroll Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">{t("payroll.payrollDetails")}</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.payPeriod")}:</span>
                  <span className="font-medium">{payrollRecord.payPeriod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.workingDays")}:</span>
                  <span className="font-medium">{payrollRecord.workingDays} days</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.overtimeHours")}:</span>
                  <span className="font-medium">{payrollRecord.overtimeHours} hours</span>
                </div>

                {payrollRecord.processedDate && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Processed Date:</span>
                    <span className="font-medium">{payrollRecord.processedDate}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Salary Breakdown</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.baseSalary")}:</span>
                  <span className="font-medium">{formatCurrency(payrollRecord.baseSalary)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.overtime")}:</span>
                  <span className="font-medium text-green-600">+{formatCurrency(payrollRecord.overtime)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.bonus")}:</span>
                  <span className="font-medium text-green-600">+{formatCurrency(payrollRecord.bonus)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.deductions")}:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(payrollRecord.deductions)}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">{t("payroll.netSalary")}:</span>
                  <span className="font-bold text-lg">{formatCurrency(payrollRecord.netSalary)}</span>
                </div>
              </div>
            </div>
          </div>

          {payrollRecord.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">{t("payroll.form.notes")}</h4>
                <p className="text-sm text-muted-foreground">{payrollRecord.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
