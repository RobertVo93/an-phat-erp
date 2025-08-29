import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { AttendanceRecord } from "@/types/attendance"
import { extractHourMinute, formatDate, formatLargeCurrency, getAttendanceShiftColor, getAttendanceStatusColor, getCustomerInitialCharacter } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

interface AttendanceListCardsProps {
  attendanceRecords: AttendanceRecord[]
  onView: (record: AttendanceRecord) => void
  onEdit: (record: AttendanceRecord) => void
  onDelete: (record: AttendanceRecord) => void
}

export const AttendanceListCards: React.FC<AttendanceListCardsProps> = ({
  attendanceRecords,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage()
  const { isAdmin } = useAuth()
  return (
    <div className="space-y-4 md:hidden">
      {attendanceRecords.map((record) => (
        <Card key={record.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={record.employee?.name!} />
                <AvatarFallback>{getCustomerInitialCharacter(record.employee?.name!)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{record.employee?.name!}</h3>
                <p className="text-sm text-muted-foreground">{record.employee?.number!}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(record)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t("attendance.view")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(record)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("attendance.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(record)} className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("attendance.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">{t("attendance.date")}</p>
              <p className="font-medium">{formatDate(record.date!)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("attendance.shift")}</p>
              <span className={`badge ${getAttendanceShiftColor(record.shift!)}`}>{t(`attendance.shift.${record.shift?.toLowerCase()}`)}</span>
            </div>
            <div>
              <p className="text-muted-foreground">{t("attendance.status")}</p>
              <span className={`badge ${getAttendanceStatusColor(record.status!)}`}>{t(`attendance.status.${record.status?.toLowerCase().replace(" ", "")}`)}</span>
            </div>
          </div>
          {(record.checkIn || record.checkOut) && (
            <div className="grid grid-cols-2 gap-3 text-sm mt-3 pt-3 border-t">
              {record.checkIn && (
                <div>
                  <p className="text-muted-foreground">{t("attendance.checkIn")}</p>
                  <p className="font-medium">{extractHourMinute(record.checkIn)}</p>
                </div>
              )}
              {record.checkOut && (
                <div>
                  <p className="text-muted-foreground">{t("attendance.checkOut")}</p>
                  <p className="font-medium">{extractHourMinute(record.checkOut)}</p>
                </div>
              )}
            </div>
          )}
          {
            isAdmin && (
              <div className="mt-3">
                <p className="text-muted-foreground">{t("attendance.form.paidAmount")}</p>
                <p className="font-medium">{formatLargeCurrency(record.paidAmount!)}</p>
              </div>
            )
          }
        </Card>
      ))}
    </div>
  )
}
