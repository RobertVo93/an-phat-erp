"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Employee } from "@/types/employee"
import { useLanguage } from "@/contexts/language-context"
import { Mail, Phone, MapPin, Building, Calendar, DollarSign, User, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { EmployeeStatus, EmployeeType } from "@/types"

interface EmployeeViewModalProps {
  isOpen: boolean
  onClose: () => void
  employee: Employee | null
}

export function EmployeeViewModal({ isOpen, onClose, employee }: EmployeeViewModalProps) {
  const { t } = useLanguage()

  if (!employee) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case EmployeeStatus.active:
        return "bg-green-100 text-green-800"
      case EmployeeStatus.inactive:
        return "bg-red-100 text-red-800"
      case EmployeeStatus.onLeave:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEmployeeTypeColor = (type: string) => {
    switch (type) {
      case EmployeeType.fullTime:
        return "bg-blue-100 text-blue-800"
      case EmployeeType.partTime:
        return "bg-purple-100 text-purple-800"
      case EmployeeType.contract:
        return "bg-orange-100 text-orange-800"
      case EmployeeType.intern:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case EmployeeStatus.active:
        return t("employees.status.active")
      case EmployeeStatus.inactive:
        return t("employees.status.inactive")
      case EmployeeStatus.onLeave:
        return t("employees.status.onLeave")
      default:
        return status
    }
  }

  const translateEmployeeType = (type: string) => {
    switch (type) {
      case EmployeeType.fullTime:
        return t("employees.type.fullTime")
      case EmployeeType.partTime:
        return t("employees.type.partTime")
      case EmployeeType.contract:
        return t("employees.type.contract")
      case EmployeeType.intern:
        return t("employees.type.intern")
      default:
        return type
    }
  }

  const translateDepartment = (department: string) => {
    switch (department) {
      case "IT":
        return t("employees.departments.it")
      case "Marketing":
        return t("employees.departments.marketing")
      case "Finance":
        return t("employees.departments.finance")
      case "Sales":
        return t("employees.departments.sales")
      case "HR":
        return t("employees.departments.hr")
      case "Operations":
        return t("employees.departments.operations")
      default:
        return department
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("employees.viewEmployee")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {employee.number}</p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusColor(employee.status!)}>{translateStatus(employee.status!)}</Badge>
              <Badge variant="outline" className={getEmployeeTypeColor(employee.employeeType!)}>
                {translateEmployeeType(employee.employeeType!)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">{t("employees.form.contactInfo")}</h4>

              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.email || "N/A"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.phone || "N/A"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.address || "N/A"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {t("employees.form.emergencyContact")}: {employee.emergencyContact || "N/A"}
                </span>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">{t("employees.form.workInfo")}</h4>

              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employee.position || "N/A"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{translateDepartment(employee.department || "N/A")}</span>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{employee.salary || "N/A"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {t("employees.hireDate")}: {formatDate(employee.hireDate!) || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {employee.notes && (
            <div className="space-y-2">
              <h4 className="font-semibold">{t("employees.form.notes")}</h4>
              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">{employee.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
