"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PayrollRecord } from "@/types/payroll"
import { useLanguage } from "@/contexts/language-context"
import { 
  extractHourMinute, 
  formatDate, 
  formatLargeCurrency, 
  getAttendanceShiftColor, 
  getAttendanceStatusColor, 
  getCustomerInitialCharacter, 
  getPayrollStatusColor 
} from "@/lib/utils"
import { ClientsideTable, ClientsideTableColumn } from "@/components/common/table/ClientsideTable"
import { AttendanceRecord } from "@/types"
import { useAuth } from "@/contexts/auth-context"

interface PayrollViewModalProps {
  isOpen: boolean
  onClose: () => void
  payrollRecord: PayrollRecord | null
}

export function PayrollViewModal({ isOpen, onClose, payrollRecord }: PayrollViewModalProps) {
  const { t } = useLanguage()
  const { isAdmin } = useAuth()

  const attendanceColumns: ClientsideTableColumn<AttendanceRecord>[] = [
    {
      key: "date",
      title: t("attendance.date"),
      sortable: true,
      render: (record) => formatDate(record.date!),
    },
    {
      key: "shift",
      title: t("attendance.shift"),
      sortable: false,
      render: (record) => (
        <Badge className={getAttendanceShiftColor(record.shift!)} variant="secondary">
          {t(`attendance.shift.${record.shift?.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      key: "checkIn",
      title: t("attendance.checkIn"),
      sortable: false,
      render: (record) => extractHourMinute(record.checkIn!) || "-",
    },
    {
      key: "checkOut",
      title: t("attendance.checkOut"),
      sortable: false,
      render: (record) => extractHourMinute(record.checkOut!) || "-",
    },
    {
      key: "workHours",
      title: t("attendance.workHours"),
      sortable: false,
      render: (record) => record.workHours || "-",
    },
    {
      key: "status",
      title: t("attendance.status"),
      sortable: false,
      render: (record) => (
        <Badge className={getAttendanceStatusColor(record.status!)}>
          {t(`attendance.status.${record.status?.toLowerCase().replace(" ", "")}`)}
        </Badge>
      ),
    },
    {
      key: "paidAmount",
      title: t("attendance.form.paidAmount"),
      sortable: false,
      render: (record) => isAdmin ? formatLargeCurrency(record.paidAmount!) : "-",
    },
  ]

  if (!payrollRecord) return null
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("payroll.viewPayroll")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage alt={payrollRecord?.employee?.name!} />
              <AvatarFallback className="text-lg">{getCustomerInitialCharacter(payrollRecord?.employee?.name!)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold">{payrollRecord?.employee?.name!}</h3>
                <Badge className={getPayrollStatusColor(payrollRecord?.status!)}>
                  {t(`payroll.status.${payrollRecord.status?.toLowerCase()}`)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {payrollRecord?.employee?.position!} - {t(`payroll.departments.${payrollRecord?.employee?.department?.toLowerCase()}`)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("payroll.form.employeeId")}: {payrollRecord.employee?.number}
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
                  <span className="text-sm text-muted-foreground">{t("payroll.workingShifts")}:</span>
                  <span className="font-medium">{payrollRecord.workingShifts} {t("payroll.shifts")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.workingHours")}:</span>
                  <span className="font-medium">{payrollRecord.workingHours}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">{t("payroll.balaryBreakdown")}</h4>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.baseSalary")}:</span>
                  <span className="font-medium">{formatLargeCurrency(payrollRecord?.employee?.salary!)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.bonus")}:</span>
                  <span className="font-medium">{formatLargeCurrency(payrollRecord?.bonus!)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("payroll.deductions")}:</span>
                  <span className="font-medium">{formatLargeCurrency(payrollRecord?.deductions!)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">{t("payroll.totalSalary")}:</span>
                  <span className="font-bold text-lg">{formatLargeCurrency(payrollRecord?.totalSalary!)}</span>
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

          {payrollRecord.attendanceRecords && (
            <div className="max-w-full overflow-x-auto">
              <h4 className="font-semibold mb-2">{t("payroll.attendanceRecords")}</h4>
              <ClientsideTable
                columns={attendanceColumns}
                data={payrollRecord.attendanceRecords}
                pageSize={10}
                initialSortBy="date"
                initialSortOrder="desc"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
