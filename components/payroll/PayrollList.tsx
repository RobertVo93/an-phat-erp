import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Check } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { PayrollRecord } from "@/types/payroll"
import { PayrollStatus } from "@/types"
import { formatLargeCurrency, getCustomerInitialCharacter, getPayrollStatusColor } from "@/lib/utils"

interface PayrollListProps {
  payrollRecords: PayrollRecord[]
  onView: (record: PayrollRecord) => void
  onApprove: (record: PayrollRecord) => void
}

export const PayrollList: React.FC<PayrollListProps> = ({
  payrollRecords,
  onView,
  onApprove,
}) => {
  const { t } = useLanguage()
  return (
    <div className="space-y-4">
      {payrollRecords.map((record) => (
        <div
          key={record.id}
          className="flex flex-col space-y-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt={record.employee?.name!} />
              <AvatarFallback>{getCustomerInitialCharacter(record.employee?.name!)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <h3 className="text-sm font-medium">{record.employee?.name!}</h3>
                <Badge className={getPayrollStatusColor(record.status!)}>
                  {t(`payroll.status.${record.status?.toLowerCase()}`)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {record.employee?.position} - {t(`payroll.departments.${record.employee?.department!.toLowerCase()}`)}
              </p>
              <p className="text-xs text-muted-foreground">{record.payPeriod}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5 sm:gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t("payroll.baseSalary")}</p>
              <p className="font-medium">{formatLargeCurrency(record.employee?.salary!)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t("payroll.workingShifts")}</p>
              <p className="font-medium">{record.workingShifts}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t("payroll.totalSalary")}</p>
              <p className="font-bold text-lg">{formatLargeCurrency(record.totalSalary!)}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(record)}>
                <Eye className="mr-2 h-4 w-4" />
                {t("payroll.viewPayroll")}
              </DropdownMenuItem>
              {record.status !== PayrollStatus.processed && (
                <DropdownMenuItem onClick={() => onApprove(record)} className="text-green-500">
                  <Check className="mr-2 h-4 w-4" />
                  {t("payroll.approvePayroll")}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
