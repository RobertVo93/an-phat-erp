import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { AttendanceRecord } from "@/types/attendance"
import { extractHourMinute, formatDate, formatLargeCurrency, getAttendanceShiftColor, getAttendanceStatusColor } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

interface AttendanceServersideTableProps {
  data: AttendanceRecord[]
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: "asc" | "desc"
  onPageChange: (page: number) => void
  onSort: (field: string) => void
  loading: boolean
  totalPages: number
  onView: (record: AttendanceRecord) => void
  onEdit: (record: AttendanceRecord) => void
  onDelete: (record: AttendanceRecord) => void
}

export const AttendanceServersideTable: React.FC<AttendanceServersideTableProps> = ({
  data,
  total,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
  onPageChange,
  onSort,
  loading,
  totalPages,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage()
  const { isAdmin } = useAuth()
  const columns: ServersideTableColumn<AttendanceRecord>[] = [
    {
      key: "employee",
      title: t("attendance.employee"),
      sortable: true,
      render: (record) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={record.employee?.name!} />
          </Avatar>
          <div>
            <p className="font-medium text-sm">{record.employee?.name!}</p>
            <p className="text-xs text-muted-foreground">{record.employee?.number!}</p>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      title: t("attendance.date"),
      sortable: true,
      render: (record) => formatDate(record.date!),
    },
    {
      key: "shift",
      title: t("attendance.shift"),
      sortable: false,
      render: (record) => (
        <Badge className={getAttendanceShiftColor(record.shift!)} variant="secondary">
          {t(`attendance.shift.${record.shift?.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      key: "checkIn",
      title: t("attendance.checkIn"),
      sortable: false,
      render: (record) => extractHourMinute(record.checkIn!) || "-",
    },
    {
      key: "checkOut",
      title: t("attendance.checkOut"),
      sortable: false,
      render: (record) => extractHourMinute(record.checkOut!) || "-",
    },
    {
      key: "status",
      title: t("attendance.status"),
      sortable: false,
      render: (record) => (
        <Badge className={getAttendanceStatusColor(record.status!)}>
          {t(`attendance.status.${record.status?.replace(" ", "")}`)}
        </Badge>
      ),
    },
    {
      key: "paidAmount",
      title: t("attendance.form.paidAmount"),
      sortable: false,
      render: (record) => isAdmin ? formatLargeCurrency(record.paidAmount!) : "-",
    },
    {
      key: "actions",
      title: t("attendance.actions"),
      sortable: false,
      render: (record) => (
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
      ),
    },
  ]
  return (
    <div className="hidden md:block overflow-x-auto">
      <ServersideTable
        columns={columns as ServersideTableColumn<{ id: string | number }>[]}
        data={data as { id: string | number }[]}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onPageChange={onPageChange}
        onSort={onSort}
        loading={loading}
        totalPages={totalPages}
      />
    </div>
  )
}
