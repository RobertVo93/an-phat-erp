"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { formatDate, formatSystemNumber } from "@/lib/utils"
import type {
  IEmployeeDetailAttendance,
  IEmployeeDetailProduction,
} from "@/types/employee-detail"
import { CalendarCheck2, Factory } from "lucide-react"

interface IEmployeeActivityCardProps {
  attendanceRecords: IEmployeeDetailAttendance[]
  productionRecords: IEmployeeDetailProduction[]
}

export function EmployeeActivityCard({
  attendanceRecords,
  productionRecords,
}: IEmployeeActivityCardProps) {
  const { t } = useLanguage()
  const recentAttendance = attendanceRecords.slice(0, 5)
  const recentProduction = productionRecords.slice(0, 5)

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarCheck2 className="h-5 w-5 text-blue-700" />
            {t("employees.detail.recentAttendance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentAttendance.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">{t("employees.detail.noAttendance")}</p>
          ) : (
            <div className="divide-y">
              {recentAttendance.map((record) => (
                <div key={record.id || record.number} className="grid grid-cols-[1fr_auto] gap-4 p-4">
                  <div>
                    <p className="font-semibold">{record.number || "-"}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.date ? formatDate(record.date) : "-"} · {record.shift || "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{record.workHours ?? 0}h</p>
                    <p className="text-xs text-muted-foreground">{record.status || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Factory className="h-5 w-5 text-teal-700" />
            {t("employees.detail.recentProduction")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentProduction.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">{t("employees.detail.noProduction")}</p>
          ) : (
            <div className="divide-y">
              {recentProduction.map((record) => (
                <div key={record.id || record.number} className="grid grid-cols-[1fr_auto] gap-4 p-4">
                  <div>
                    <p className="font-semibold">{record.number || "-"}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.product?.name || "-"} · {record.date ? formatDate(record.date) : "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatSystemNumber(record.quantity ?? 0)}</p>
                    <p className="text-xs text-muted-foreground">{record.status || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
