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

interface AttendanceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<AttendanceRecord, "id" | "createdAt" | "updatedAt">) => void
  onUpdate?: (id: string, data: Partial<AttendanceRecord>) => void
  record?: AttendanceRecord
  mode: "create" | "edit"
  employees: Array<{ id: string; name: string; department: string; position: string }>
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
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    date: "",
    shift: "",
    checkIn: "",
    checkOut: "",
    status: "",
    workHours: 0,
    overtimeHours: 0,
    dailyWage: 0,
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (record && mode === "edit") {
      setFormData({
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        date: record.date,
        shift: record.shift,
        checkIn: record.checkIn || "",
        checkOut: record.checkOut || "",
        status: record.status,
        workHours: record.workHours,
        overtimeHours: record.overtimeHours,
        dailyWage: record.dailyWage,
        notes: record.notes || "",
      })
    } else {
      setFormData({
        employeeId: "",
        employeeName: "",
        date: new Date().toISOString().split("T")[0],
        shift: "",
        checkIn: "",
        checkOut: "",
        status: "",
        workHours: 0,
        overtimeHours: 0,
        dailyWage: 0,
        notes: "",
      })
    }
    setErrors({})
  }, [record, mode, isOpen, employees])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.employeeId) {
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
    if (formData.workHours < 0) {
      newErrors.workHours = t("attendance.form.workHoursRequired")
    }
    if (formData.dailyWage < 0) {
      newErrors.dailyWage = t("attendance.form.dailyWageRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const attendanceData = {
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      date: formData.date,
      shift: formData.shift as "Morning" | "Afternoon" | "Evening",
      checkIn: formData.checkIn || undefined,
      checkOut: formData.checkOut || undefined,
      status: formData.status as "Present" | "Absent" | "Late" | "Half Day" | "Overtime",
      workHours: formData.workHours,
      overtimeHours: formData.overtimeHours,
      dailyWage: formData.dailyWage,
      notes: formData.notes || undefined,
    }

    if (mode === "edit" && record && onUpdate) {
      onUpdate(record.id, attendanceData)
    } else {
      onSave(attendanceData)
    }

    onClose()
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
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
                value={formData.employeeId}
                onValueChange={(value) => {
                  const employee = employees.find((emp) => emp.id === value)
                  if (employee) {
                    handleInputChange("employeeId", employee.id)
                    handleInputChange("employeeName", employee.name)
                  }
                }}
              >
                <SelectTrigger className={errors.employeeId ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("attendance.form.selectEmployee")} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
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
                  <SelectItem value="Morning">{t("attendance.shift.morning")}</SelectItem>
                  <SelectItem value="Afternoon">{t("attendance.shift.afternoon")}</SelectItem>
                  <SelectItem value="Evening">{t("attendance.shift.evening")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.shift && <p className="text-sm text-red-500">{errors.shift}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkIn">{t("attendance.form.checkIn")}</Label>
              <Input
                id="checkIn"
                type="time"
                value={formData.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">{t("attendance.form.checkOut")}</Label>
              <Input
                id="checkOut"
                type="time"
                value={formData.checkOut}
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
                  <SelectItem value="Present">{t("attendance.status.present")}</SelectItem>
                  <SelectItem value="Absent">{t("attendance.status.absent")}</SelectItem>
                  <SelectItem value="Late">{t("attendance.status.late")}</SelectItem>
                  <SelectItem value="Half Day">{t("attendance.status.halfDay")}</SelectItem>
                  <SelectItem value="Overtime">{t("attendance.status.overtime")}</SelectItem>
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
                onChange={(e) => handleInputChange("workHours", Number.parseFloat(e.target.value) || 0)}
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
              value={formData.notes}
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
