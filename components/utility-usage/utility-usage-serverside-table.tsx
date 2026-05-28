import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import type { IUtilityUsage } from "@/types"
import { formatDateTime, formatNumberWithCommas, getUtilityStatusColor } from "@/lib/utils"
import { Edit, MoreVertical, Trash2 } from "lucide-react"

interface UtilityUsageServersideTableProps {
  data: IUtilityUsage[]
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: "asc" | "desc"
  loading: boolean
  totalPages: number
  onPageChange: (page: number) => void
  onSort: (field: string) => void
  onEdit: (record: IUtilityUsage) => void
  onDelete: (record: IUtilityUsage) => void
}

export function UtilityUsageServersideTable({
  data,
  total,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
  loading,
  totalPages,
  onPageChange,
  onSort,
  onEdit,
  onDelete,
}: UtilityUsageServersideTableProps) {
  const { t } = useLanguage()

  const columns: ServersideTableColumn<IUtilityUsage>[] = [
    {
      key: "number",
      title: t("common.number"),
      sortable: true,
      render: (row) => <span className="font-medium">{row.number || "-"}</span>,
    },
    {
      key: "utility",
      title: t("utilityUsage.utility"),
      sortable: false,
      render: (row) => <span>{row.utility?.name || "-"}</span>,
    },
    {
      key: "usageTime",
      title: t("utilityUsage.usageTime"),
      sortable: true,
      render: (row) => <span>{row.usageTime ? formatDateTime(new Date(row.usageTime), "/") : "-"}</span>,
    },
    {
      key: "amountBefore",
      title: t("utilityUsage.amountBefore"),
      sortable: true,
      render: (row) => <span>{formatNumberWithCommas(row.amountBefore ?? 0)}</span>,
    },
    {
      key: "amountAfter",
      title: t("utilityUsage.amountAfter"),
      sortable: true,
      render: (row) => <span>{formatNumberWithCommas(row.amountAfter ?? 0)}</span>,
    },
    {
      key: "totalUsage",
      title: t("utilityUsage.totalUsage"),
      sortable: true,
      render: (row) => <span className="font-semibold">{formatNumberWithCommas(row.totalUsage ?? 0) + " " + t(`utilities.${row.unit?.toLowerCase()}`)}</span>,
    },
    {
      key: "status",
      title: t("utilityUsage.status"),
      sortable: true,
      render: (row) => (
        <Badge className={getUtilityStatusColor(row.status || "draft")}>{t(`utilityUsage.status.${row.status}`)}</Badge>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      sortable: false,
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Edit className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
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
  )
}
