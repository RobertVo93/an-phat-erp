"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import type { AttendanceRecord } from "@/types/attendance"
import { AttendanceShift, AttendanceStatus, Employee } from "@/types"
import { extractHourMinute } from "@/lib/utils"

interface AttendanceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<AttendanceRecord, "id" | "createdAt" | "updatedAt">) => void
  onUpdate?: (id: string, data: Partial<AttendanceRecord>) => void
  record?: AttendanceRecord
  mode: "create" | "edit"
  employees: Employee[]
}

export function AttendanceFormModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  record,
  mode,
  employees,
}: AttendanceFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<AttendanceRecord>({
    date: new Date().toISOString().split("T")[0],
    shift: AttendanceShift.morning,
    checkIn: new Date(),
    checkOut: new Date(),
    status: AttendanceStatus.present,
    workHours: 0,
    overtimeHours: 0,
    dailyWage: 0,
    notes: "",
    employee: undefined,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (record && mode === "edit") {
      setFormData(record)
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        shift: AttendanceShift.morning,
        checkIn: new Date(),
        checkOut: new Date(),
        status: AttendanceStatus.present,
        workHours: 0,
        overtimeHours: 0,
        dailyWage: 0,
        notes: "",
        employee: undefined,
      })
    }
    setErrors({})
  }, [record, mode, isOpen, employees])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.employee) {
      newErrors.employeeId = t("attendance.form.employeeRequired")
    }
    if (!formData.date) {
      newErrors.date = t("attendance.form.dateRequired")
    }
    if (!formData.shift) {
      newErrors.shift = t("attendance.form.shiftRequired")
    }
    if (!formData.status) {
      newErrors.status = t("attendance.form.statusRequired")
    }
    if (formData.workHours! < 0) {
      newErrors.workHours = t("attendance.form.workHoursRequired")
    }
    if (formData.dailyWage! < 0) {
      newErrors.dailyWage = t("attendance.form.dailyWageRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const attendanceData = {
      date: formData.date,
      shift: formData.shift as AttendanceShift,
      checkIn: formData.checkIn || undefined,
      checkOut: formData.checkOut || undefined,
      status: formData.status as AttendanceStatus,
      workHours: formData.workHours,
      overtimeHours: formData.overtimeHours,
      dailyWage: formData.dailyWage,
      notes: formData.notes || "",
      employee: formData.employee
    }

    if (mode === "edit" && record && onUpdate) {
      onUpdate(record.id!, attendanceData)
    } else {
      onSave(attendanceData)
    }

    onClose()
  }

  function calculateWorkHours(checkIn: Date | string, checkOut: Date | string): number {
    if (!checkIn || !checkOut) return 0;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
      return 0;
    }
    const diffMinutes = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60);
    const roundedMinutes = Math.round(diffMinutes / 15) * 15;
    return Math.round((roundedMinutes / 60) * 100) / 100;
  }

  const handleInputChange = (field: string, value: string | number) => {
    switch (field) {
      case ("employeeId"): {
        const employee = employees.find((emp) => emp.id === value)
        if (employee) {
          setFormData((prev) => ({ ...prev, employee: employee }))
        }
        break;
      }
      case ("date"): {
        const newDate = new Date(value)
        setFormData((prev) => ({
          ...prev,
          date: value.toString(),
          checkIn: newDate,
          checkOut: newDate,
          workHours: 0,
        }));
        break;
      }
      case ("checkIn"): {
        const checkTime = `${formData.date}T${value}`;
        setFormData((prev) => ({
          ...prev,
          [field]: new Date(checkTime),
          workHours: calculateWorkHours(new Date(checkTime), formData.checkOut!)
        }));
        break;
      }
      case ("checkOut"): {
        const checkTime = `${formData.date}T${value}`;
        setFormData((prev) => ({
          ...prev,
          [field]: new Date(checkTime),
          workHours: calculateWorkHours(formData.checkIn!, new Date(checkTime))
        }));
        break;
      }
      default: {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: "" }))
        }
        break;
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? t("attendance.editRecord") : t("attendance.addRecord")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="employee">{t("attendance.form.employee")}</Label>
              <Select
                value={formData.employee?.id!}
                onValueChange={(value) => { handleInputChange("employeeId", value) }}
              >
                <SelectTrigger className={errors.employeeId ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("attendance.form.selectEmployee")} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id!}>
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {employee.id} - {employee.department}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{t("attendance.form.date")}</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">{t("attendance.form.shift")}</Label>
              <Select value={formData.shift} onValueChange={(value) => handleInputChange("shift", value)}>
                <SelectTrigger className={errors.shift ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("attendance.form.shift")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AttendanceShift.morning}>{t("attendance.shift.morning")}</SelectItem>
                  <SelectItem value={AttendanceShift.afternoon}>{t("attendance.shift.afternoon")}</SelectItem>
                  <SelectItem value={AttendanceShift.evening}>{t("attendance.shift.evening")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.shift && <p className="text-sm text-red-500">{errors.shift}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkIn">{t("attendance.form.checkIn")}</Label>
              <Input
                id="checkIn"
                type="time"
                value={formData.checkIn ? extractHourMinute(formData.checkIn!) : ""}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">{t("attendance.form.checkOut")}</Label>
              <Input
                id="checkOut"
                type="time"
                value={formData.checkOut ? extractHourMinute(formData.checkOut!) : ""}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("attendance.form.status")}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("attendance.form.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AttendanceStatus.present}>{t("attendance.status.present")}</SelectItem>
                  <SelectItem value={AttendanceStatus.absent}>{t("attendance.status.absent")}</SelectItem>
                  <SelectItem value={AttendanceStatus.late}>{t("attendance.status.late")}</SelectItem>
                  <SelectItem value={AttendanceStatus.halfDay}>{t("attendance.status.halfDay")}</SelectItem>
                  <SelectItem value={AttendanceStatus.overtime}>{t("attendance.status.overtime")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workHours">{t("attendance.form.workHours")}</Label>
              <Input
                id="workHours"
                type="number"
                step="0.25"
                min="0"
                max="24"
                value={formData.workHours}
                readOnly
                // onChange={(e) => handleInputChange("workHours", Number.parseFloat(e.target.value) || 0)}
                className={errors.workHours ? "border-red-500" : ""}
              />
              {errors.workHours && <p className="text-sm text-red-500">{errors.workHours}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtimeHours">{t("attendance.form.overtimeHours")}</Label>
              <Input
                id="overtimeHours"
                type="number"
                step="0.25"
                min="0"
                max="12"
                value={formData.overtimeHours}
                onChange={(e) => handleInputChange("overtimeHours", Number.parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyWage">{t("attendance.form.dailyWage")}</Label>
              <Input
                id="dailyWage"
                type="number"
                min="0"
                step="0.01"
                value={formData.dailyWage}
                onChange={(e) => handleInputChange("dailyWage", Number.parseFloat(e.target.value) || 0)}
                className={errors.dailyWage ? "border-red-500" : ""}
              />
              {errors.dailyWage && <p className="text-sm text-red-500">{errors.dailyWage}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("attendance.form.notes")}</Label>
            <Textarea
              id="notes"
              value={formData.notes ? formData.notes : ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("attendance.form.cancel")}
            </Button>
            <Button type="submit">{t("attendance.form.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
