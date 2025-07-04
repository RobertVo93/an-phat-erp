"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { Calendar, Clock, DollarSign, User, FileText } from "lucide-react"
import type { AttendanceRecord } from "@/types/attendance"
import { AttendanceShift, AttendanceStatus } from "@/types"
import { extractHourMinute, formatLocalDatetime } from "@/lib/utils"

interface AttendanceViewModalProps {
  isOpen: boolean
  onClose: () => void
  record: AttendanceRecord | null
}

export function AttendanceViewModal({ isOpen, onClose, record }: AttendanceViewModalProps) {
  const { t } = useLanguage()

  if (!record) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case AttendanceStatus.present:
        return "bg-green-100 text-green-800"
      case AttendanceStatus.late:
        return "bg-yellow-100 text-yellow-800"
      case AttendanceStatus.absent:
        return "bg-red-100 text-red-800"
      case AttendanceStatus.halfDay:
        return "bg-blue-100 text-blue-800"
      case AttendanceStatus.overtime:
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case AttendanceShift.morning:
        return "bg-orange-100 text-orange-800"
      case AttendanceShift.afternoon:
        return "bg-blue-100 text-blue-800"
      case AttendanceShift.evening:
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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
                <Badge className={getStatusColor(record.status!)}>
                  {t(`attendance.status.${record.status?.toLowerCase().replace(" ", "")}`)}
                </Badge>
                <Badge className={getShiftColor(record.shift!)}>
                  {t(`attendance.shift.${record.shift?.toLowerCase()}`)}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("attendance.form.employeeId")}: {record.employee?.id!}
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

            {record.checkIn && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{t("attendance.checkIn")}</span>
                </div>
                <p className="text-sm">{extractHourMinute(record.checkIn)}</p>
              </div>
            )}

            {record.checkOut && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">{t("attendance.checkOut")}</span>
                </div>
                <p className="text-sm">{extractHourMinute(record.checkOut)}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Work Hours and Wage Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{t("attendance.workHours")}</span>
              </div>
              <p className="text-sm">{record.workHours}h</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">{t("attendance.overtime")}</span>
              </div>
              <p className="text-sm">{record.overtimeHours}h</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{t("attendance.dailyWage")}</span>
              </div>
              <p className="text-sm">${record.dailyWage?.toFixed(2)}</p>
            </div>
          </div>

          {record.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t("attendance.form.notes")}</span>
                </div>
                <p className="text-sm text-muted-foreground">{record.notes}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>{t("attendance.close")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
