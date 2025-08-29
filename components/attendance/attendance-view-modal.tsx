"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { Calendar, Clock, User, FileText, DollarSign } from "lucide-react"
import type { AttendanceRecord } from "@/types/attendance"
import { 
  extractHourMinute, 
  formatDate, 
  formatLargeCurrency, 
  getAttendanceShiftColor, 
  getAttendanceStatusColor, 
  getAttendanceSubStatusColor,
} from "@/lib/utils"
import { AttendanceStatus } from "@/types"
import { useAuth } from "@/contexts/auth-context"

interface AttendanceViewModalProps {
  isOpen: boolean
  onClose: () => void
  record: AttendanceRecord | null
}

export function AttendanceViewModal({ isOpen, onClose, record }: AttendanceViewModalProps) {
  const { t } = useLanguage()
  const { isAdmin } = useAuth()
  if (!record) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("attendance.viewRecord")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{record.employee?.name!}</h3>
              <div className="flex gap-2">
                <Badge className={getAttendanceStatusColor(record.status!)}>
                  {t(`attendance.status.${record.status}`)}
                </Badge>
                {
                  record.status === AttendanceStatus.completed && (
                    <Badge className={getAttendanceSubStatusColor(record.subStatus!)}>
                      {t(`attendance.subStatus.${record.subStatus}`)}
                    </Badge>
                  )
                }
                <Badge className={getAttendanceShiftColor(record.shift!)}>
                  {t(`attendance.shift.${record.shift?.toLowerCase()}`)}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("attendance.form.employeeId")}: {record.employee?.number!}
            </p>
          </div>

          <Separator />

          {/* Date and Time Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t("attendance.date")}</span>
              </div>
              <p className="text-sm">{formatDate(record.date!)}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t("attendance.shift")}</span>
              </div>
              <p className="text-sm">{t(`attendance.shift.${record.shift?.toLowerCase()}`)}</p>
            </div>

            <div className="space-y-3" hidden={!record.checkIn}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{t("attendance.checkIn")}</span>
              </div>
              <p className="text-sm">{extractHourMinute(record?.checkIn!)}</p>
            </div>

            <div className="space-y-3" hidden={!record.checkOut}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium">{t("attendance.checkOut")}</span>
              </div>
              <p className="text-sm">{extractHourMinute(record?.checkOut!)}</p>
            </div>

            {
              isAdmin && (
                <div className="space-y-3" hidden={!record.paidAmount}>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t("attendance.form.paidAmount")}</span>
                  </div>
                  <p className="text-sm">{formatLargeCurrency(record?.paidAmount!)}</p>
                </div>
              )
            }
          </div>

          <Separator />

          <div className="space-y-3" hidden={!record.notes}>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("attendance.form.notes")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{record.notes}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>{t("attendance.close")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
