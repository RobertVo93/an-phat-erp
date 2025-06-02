"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { AlertTriangle } from "lucide-react"
import type { AttendanceRecord } from "@/types/attendance"

interface AttendanceDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  record: AttendanceRecord | null
}

export function AttendanceDeleteModal({ isOpen, onClose, onConfirm, record }: AttendanceDeleteModalProps) {
  const { t } = useLanguage()

  if (!record) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t("attendance.delete.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t("attendance.delete.message")}</p>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm">
              <strong>{t("attendance.employee")}:</strong> {record.employeeName}
            </p>
            <p className="text-sm">
              <strong>{t("attendance.date")}:</strong> {new Date(record.date).toLocaleDateString("vi-VN")}
            </p>
            <p className="text-sm">
              <strong>{t("attendance.shift")}:</strong> {t(`attendance.shift.${record.shift.toLowerCase()}`)}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            {t("attendance.delete.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {t("attendance.delete.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
