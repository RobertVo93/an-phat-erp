"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ADMIN_ROUTES } from "@/constants/nav"
import { useLanguage } from "@/contexts/language-context"
import { getEmployeeStatusColor } from "@/lib/utils"
import type { IEmployeeDetail } from "@/types/employee-detail"
import { ArrowLeft, Edit, IdCard, UserRound } from "lucide-react"
import Link from "next/link"

interface IEmployeeDetailHeaderProps {
  employee: IEmployeeDetail
  onEdit: () => void
}

export function EmployeeDetailHeader({ employee, onEdit }: IEmployeeDetailHeaderProps) {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-[linear-gradient(135deg,#172554_0%,#1d4ed8_55%,#0f766e_120%)] p-5 text-white shadow-xl md:p-7">
      <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[32px] border-white/10" />
      <div className="absolute bottom-0 left-1/3 h-20 w-72 translate-y-10 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm" className="bg-white/15 text-white hover:bg-white/25">
              <Link href={ADMIN_ROUTES.employee()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("common.back")}
              </Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onEdit}
              className="bg-cyan-200 text-slate-950 hover:bg-cyan-100"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </Button>
          </div>

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
              <IdCard className="h-4 w-4" />
              {employee.number}
            </p>
            <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight md:text-5xl">
              <UserRound className="h-9 w-9 text-cyan-200" />
              {employee.name}
            </h1>
            <p className="text-sm text-white/75 md:text-base">
              {[employee.position, employee.department].filter(Boolean).join(" · ") || "-"}
            </p>
          </div>
        </div>

        {employee.status && (
          <Badge className={`${getEmployeeStatusColor(employee.status)} border border-white/30 px-4 py-2 text-sm shadow-lg`}>
            {t(`employees.status.${employee.status}`)}
          </Badge>
        )}
      </div>
    </section>
  )
}
