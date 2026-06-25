"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { IEmployeeDetail } from "@/types/employee-detail"
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleDollarSign,
  ContactRound,
  Mail,
  MapPin,
  NotebookText,
  Phone,
  ShieldCheck,
} from "lucide-react"
import type { ReactNode } from "react"

interface IEmployeeInformationCardProps {
  employee: IEmployeeDetail
}

interface IInformationItem {
  label: string
  value: ReactNode
  icon: typeof Mail
}

export function EmployeeInformationCard({ employee }: IEmployeeInformationCardProps) {
  const { t } = useLanguage()
  const items: IInformationItem[] = [
    { icon: Mail, label: t("employees.form.email"), value: employee.email || "-" },
    { icon: Phone, label: t("employees.form.phone"), value: employee.phone || "-" },
    { icon: ContactRound, label: t("employees.form.emergencyContact"), value: employee.emergencyContact || "-" },
    { icon: MapPin, label: t("employees.form.address"), value: employee.address || "-" },
    { icon: BriefcaseBusiness, label: t("employees.form.position"), value: employee.position || "-" },
    { icon: Building2, label: t("employees.form.department"), value: t(`employees.departments.${employee.department?.toLowerCase()}`) || "-" },
    {
      icon: CircleDollarSign,
      label: t("employees.form.salary"),
      value: employee.salary !== undefined ? formatCurrency(employee.salary) : "-",
    },
    { icon: CalendarDays, label: t("employees.form.hireDate"), value: employee.hireDate ? formatDate(employee.hireDate) : "-" },
    {
      icon: ShieldCheck,
      label: t("employees.form.employeeType"),
      value: employee.employeeType ? t(`employees.type.${employee.employeeType}`) : "-",
    },
    { icon: NotebookText, label: t("employees.form.notes"), value: employee.notes || "-" },
  ]

  return (
    <Card className="overflow-hidden border-blue-100 shadow-sm">
      <CardHeader className="border-b bg-blue-50/70">
        <CardTitle className="text-lg">
          <span className="block">{t("employees.detail.profile")}</span>
          <span className="mt-1 block text-sm font-normal text-muted-foreground">
            {t("employees.detail.profileDescription")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Icon className="h-4 w-4 text-blue-700" />
              {label}
            </div>
            <div className="break-words text-sm font-semibold text-slate-950">{value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
