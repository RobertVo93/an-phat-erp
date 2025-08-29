"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import type { AttendanceRecord } from "@/types/attendance"
import { AttendanceShift, AttendanceStatus, AttendanceSubStatus, Employee } from "@/types"
import { calculateDiffWorkHours, delay, formatNumberWithCommas, formatYYYYMMDD, parseNumberInput } from "@/lib/utils"
import { MutationMode } from "@/types/base.interface"
import { Loader2 } from "lucide-react"
import { UITimePicker } from "@/components/ui/datepicker"
import { useAuth } from "@/contexts/auth-context"

interface AttendanceFormModalProps {
  onClose: () => void
  onSave: (data: Omit<AttendanceRecord, "id" | "createdAt" | "updatedAt">) => void
  onUpdate?: (id: string, data: Partial<AttendanceRecord>) => void
  isOpen: boolean
  record?: AttendanceRecord
  mode: MutationMode
  employees: Employee[]
}

const defaultFormData: AttendanceRecord = {
  date: new Date(),
  shift: AttendanceShift.morning,
  checkIn: new Date(),
  checkOut: new Date(),
  status: AttendanceStatus.draft,
  notes: "",
  employee: undefined,
  workHours: 0,
  paidAmount: 0,
}

export function AttendanceFormModal({
  onClose,
  onSave,
  onUpdate,
  isOpen,
  record,
  mode,
  employees,
}: AttendanceFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<AttendanceRecord>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isAdmin } = useAuth()

  useEffect(() => {
    if (record) {
      setFormData(record)
    } else {
      setFormData(defaultFormData)
    }
    setErrors({})
  }, [record, mode])

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      setFormData((prev) => ({
        ...prev,
        workHours: calculateDiffWorkHours(formData.checkIn!, formData.checkOut!)
      }))
    }
  }, [formData.checkIn, formData.checkOut])

  useEffect(() => {
    if (formData.shift && formData.date) {
      let checkIn = new Date()
      let checkOut = new Date()
      if (formData.shift === AttendanceShift.morning) {
        checkIn = new Date(formatYYYYMMDD(formData?.date!) + " 07:00");
        checkOut = new Date(formatYYYYMMDD(formData?.date!) + " 11:00");
      } else if (formData.shift === AttendanceShift.afternoon) {
        checkIn = new Date(formatYYYYMMDD(formData?.date!) + " 13:00");
        checkOut = new Date(formatYYYYMMDD(formData?.date!) + " 17:00");
      } else if (formData.shift === AttendanceShift.evening) {
        checkIn = new Date(formatYYYYMMDD(formData?.date!) + " 17:00");
        checkOut = new Date(formatYYYYMMDD(formData?.date!) + " 21:00");
      } else if (formData.shift === AttendanceShift.all) {
        checkIn = new Date(formatYYYYMMDD(formData?.date!) + " 07:00");
        checkOut = new Date(formatYYYYMMDD(formData?.date!) + " 17:00");
      }
      setFormData((prev) => ({
        ...prev,
        checkIn: checkIn,
        checkOut: checkOut,
      }));
    }
  }, [formData.shift, formData.date])

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
    if (formData?.workHours && formData?.workHours <= 0) {
      newErrors.workHours = t("attendance.form.workHoursInvalid")
    }
    if (formData.status === AttendanceStatus.completed && !formData.subStatus) {
      newErrors.subStatus = t("attendance.form.subStatusRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!validateForm()) {
        await delay(1000)
        setIsLoading(false)
        return
      }

      const attendanceData: AttendanceRecord = {
        date: formData.date,
        shift: formData.shift,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        status: formData.status,
        subStatus: formData.subStatus,
        workHours: formData.workHours,
        paidAmount: formData.paidAmount || 0,
        notes: formData.notes,
        employee: formData.employee
      }

      if (mode === "update" && record && onUpdate) {
        await onUpdate(record.id!, attendanceData)
      } else {
        await onSave(attendanceData)
      }
      onClose()
    }
    catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | Date) => {
    switch (field) {
      case ("employeeId"): {
        const employee = employees.find((emp) => emp.id === value)
        if (employee) {
          setFormData((prev) => ({ ...prev, employee: employee }))
        }
        break;
      }
      case ("date"): {
        setFormData((prev) => ({
          ...prev,
          date: new Date(value),
        }));
        break;
      }
      case ("status"): {
        setFormData((prev) => ({
          ...prev,
          status: value as AttendanceStatus,
          ...(value === AttendanceStatus.completed && {
            subStatus: AttendanceSubStatus.present,
          }),
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
          <DialogTitle>{mode === "update" ? t("attendance.editRecord") : t("attendance.addRecord")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="employee">{t("attendance.form.employee")} *</Label>
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
                          {employee.number} - {t(`attendance.departments.${employee.department?.toLowerCase()}`)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{t("attendance.form.date")} *</Label>
              <Input
                id="productionDate"
                type="date"
                className="h-11"
                value={formatYYYYMMDD(formData.date!)}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">{t("attendance.form.shift")} *</Label>
              <Select value={formData.shift} onValueChange={(value) => handleInputChange("shift", value)}>
                <SelectTrigger className={errors.shift ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("attendance.form.shift")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AttendanceShift).map((shift) => (
                    <SelectItem key={shift} value={shift}>
                      {t(`attendance.shift.${shift}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.shift && <p className="text-sm text-red-500">{errors.shift}</p>}
            </div>

            <div className="py-2 flex flex-col">
              <Label htmlFor="checkIn" className="pb-2">{t("attendance.form.checkIn")} *</Label>
              <UITimePicker
                selected={formData.checkIn!}
                onChange={(date) => handleInputChange("checkIn", date!)}
                timeIntervals={15}
                dateFormat="h:mm aa"
              />
            </div>

            <div className="py-2 flex flex-col">
              <Label htmlFor="checkOut" className="pb-2">{t("attendance.form.checkOut")} *</Label>
              <UITimePicker
                selected={formData.checkOut!}
                onChange={(date) => handleInputChange("checkOut", date!)}
                timeIntervals={15}
                dateFormat="h:mm aa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("attendance.form.status")} *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("attendance.form.status")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AttendanceStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`attendance.status.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            <div className="space-y-2" hidden={formData.status !== AttendanceStatus.completed}>
              <Label htmlFor="status">{t("attendance.form.subStatus")} *</Label>
              <Select value={formData.subStatus} onValueChange={(value) => handleInputChange("subStatus", value)}>
                <SelectTrigger className={errors.subStatus ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("attendance.form.subStatus")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AttendanceSubStatus).map((subStatus) => (
                    <SelectItem key={subStatus} value={subStatus}>
                      {t(`attendance.subStatus.${subStatus}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subStatus && <p className="text-sm text-red-500">{errors.subStatus}</p>}
            </div>

            <div className="space-y-2" hidden={formData.status === AttendanceStatus.completed}>
              <Label htmlFor="workHours">{t("attendance.form.workHours")}</Label>
              <Input
                id="workHours"
                type="number"
                value={formData.workHours}
                disabled={true}
                onChange={(e) => handleInputChange("workHours", e.target.value)}
              />
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="paidAmount">{t("attendance.form.paidAmount")}</Label>
                <Input 
                  id="paidAmount"
                  type="text"
                  value={formatNumberWithCommas(formData.paidAmount ?? 0)}
                  onChange={(e) => {
                      const totalCost = parseNumberInput(e.target.value);
                      if (totalCost > 0) {
                        handleInputChange("paidAmount", totalCost);
                      }
                    }}
                />
              </div>
            )}
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
          {errors.workHours && <p className="text-sm text-red-500">{errors.workHours}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("attendance.form.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {t("attendance.form.save")} {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
