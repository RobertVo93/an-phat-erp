"use client"

import { EmployeeFormModal } from "@/components/employees/employee-form-modal"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { updateEmployee } from "@/lib/httpclient/employee.client"
import { toIsoDate } from "@/lib/utils.date"
import type { Employee } from "@/types/employee"
import type { IEmployeeDetail } from "@/types/employee-detail"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { EmployeeActivityCard } from "./employee-activity-card"
import { EmployeeDetailHeader } from "./employee-detail-header"
import { EmployeeInformationCard } from "./employee-information-card"

interface IEmployeeDetailClientProps {
  employee: IEmployeeDetail
}

const toFormEmployee = (employee: IEmployeeDetail): Employee => ({
  id: employee.id,
  number: employee.number,
  name: employee.name,
  email: employee.email,
  phone: employee.phone,
  position: employee.position,
  department: employee.department,
  salary: employee.salary,
  hireDate: employee.hireDate ? new Date(employee.hireDate) : undefined,
  employeeType: employee.employeeType,
  status: employee.status,
  address: employee.address,
  emergencyContact: employee.emergencyContact,
  notes: employee.notes,
})

export function EmployeeDetailClient({ employee: initialEmployee }: IEmployeeDetailClientProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [employee, setEmployee] = useState(initialEmployee)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async (data: Omit<Employee, "id"> | Employee) => {
    try {
      setSaving(true)
      const updated = await updateEmployee(employee.id, data)
      setEmployee((current) => ({
        ...current,
        ...updated,
        id: current.id,
        createdAt: toIsoDate(updated.createdAt) ?? current.createdAt,
        updatedAt: toIsoDate(updated.updatedAt) ?? current.updatedAt,
        hireDate: toIsoDate(updated.hireDate) ?? current.hireDate,
      }))
      setShowEditModal(false)
      router.refresh()
      toast({
        title: t("common.success"),
        description: t("common.success.update"),
      })
    } catch (error) {
      console.error("[EmployeeDetailClient] Failed to update employee", error)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotUpdate"),
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <EmployeeDetailHeader employee={employee} onEdit={() => setShowEditModal(true)} />
        <EmployeeInformationCard employee={employee} />
        <EmployeeActivityCard
          attendanceRecords={employee.attendanceRecords}
          productionRecords={employee.productionRecords}
        />
      </div>

      <EmployeeFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        employee={toFormEmployee(employee)}
        mode="edit"
      />

      {saving && (
        <div className="fixed inset-0 z-50 flex cursor-wait items-center justify-center bg-background/30 backdrop-blur-[1px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </>
  )
}
