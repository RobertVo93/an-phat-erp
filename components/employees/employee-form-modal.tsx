"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Employee } from "@/types/employee"
import { useLanguage } from "@/contexts/language-context"

interface EmployeeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (employee: Omit<Employee, "id"> | Employee) => void
  employee?: Employee
  mode: "create" | "edit"
}

export function EmployeeFormModal({ isOpen, onClose, onSave, employee, mode }: EmployeeFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: "",
    hireDate: new Date().toISOString().split("T")[0],
    employeeType: "Full-time" as const,
    status: "Active" as const,
    address: "",
    emergencyContact: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (employee && mode === "edit") {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        hireDate: employee.hireDate,
        employeeType: employee.employeeType,
        status: employee.status,
        address: employee.address || "",
        emergencyContact: employee.emergencyContact || "",
        notes: employee.notes || "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        salary: "",
        hireDate: new Date().toISOString().split("T")[0],
        employeeType: "Full-time",
        status: "Active",
        address: "",
        emergencyContact: "",
        notes: "",
      })
    }
    setErrors({})
  }, [employee, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t("employees.form.nameRequired")
    }
    if (!formData.email.trim()) {
      newErrors.email = t("employees.form.emailRequired")
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("employees.form.phoneRequired")
    }
    if (!formData.position.trim()) {
      newErrors.position = t("employees.form.positionRequired")
    }
    if (!formData.department.trim()) {
      newErrors.department = t("employees.form.departmentRequired")
    }
    if (!formData.salary.trim()) {
      newErrors.salary = t("employees.form.salaryRequired")
    }
    if (!formData.hireDate.trim()) {
      newErrors.hireDate = t("employees.form.hireDateRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const employeeData = {
      ...formData,
      ...(mode === "edit" && employee ? { id: employee.id } : {}),
    }

    onSave(employeeData)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("employees.addEmployee") : t("employees.editEmployee")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("employees.form.contactInfo")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("employees.form.name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("employees.form.email")} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("employees.form.phone")} *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">{t("employees.form.emergencyContact")}</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t("employees.form.address")}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>

          {/* Work Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("employees.form.workInfo")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">{t("employees.form.position")} *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  className={errors.position ? "border-red-500" : ""}
                />
                {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">{t("employees.form.department")} *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">{t("employees.departments.it")}</SelectItem>
                    <SelectItem value="Marketing">{t("employees.departments.marketing")}</SelectItem>
                    <SelectItem value="Finance">{t("employees.departments.finance")}</SelectItem>
                    <SelectItem value="Sales">{t("employees.departments.sales")}</SelectItem>
                    <SelectItem value="HR">{t("employees.departments.hr")}</SelectItem>
                    <SelectItem value="Operations">{t("employees.departments.operations")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">{t("employees.form.salary")} *</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  placeholder="$0.00"
                  className={errors.salary ? "border-red-500" : ""}
                />
                {errors.salary && <p className="text-sm text-red-500">{errors.salary}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">{t("employees.form.hireDate")} *</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => handleInputChange("hireDate", e.target.value)}
                  className={errors.hireDate ? "border-red-500" : ""}
                />
                {errors.hireDate && <p className="text-sm text-red-500">{errors.hireDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeType">{t("employees.form.employeeType")}</Label>
                <Select
                  value={formData.employeeType}
                  onValueChange={(value) => handleInputChange("employeeType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">{t("employees.type.fullTime")}</SelectItem>
                    <SelectItem value="Part-time">{t("employees.type.partTime")}</SelectItem>
                    <SelectItem value="Contract">{t("employees.type.contract")}</SelectItem>
                    <SelectItem value="Intern">{t("employees.type.intern")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t("employees.form.status")}</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">{t("employees.status.active")}</SelectItem>
                    <SelectItem value="Inactive">{t("employees.status.inactive")}</SelectItem>
                    <SelectItem value="On Leave">{t("employees.status.onLeave")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("employees.form.notes")}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("employees.form.cancel")}
            </Button>
            <Button type="submit">{t("employees.form.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
