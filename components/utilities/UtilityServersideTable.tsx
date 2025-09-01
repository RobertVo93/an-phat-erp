import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { Utility } from "@/types/utility"
import { formatLargeCurrency, getUtilityStatusColor } from "@/lib/utils"

interface UtilityServersideTableProps {
  data: Utility[]
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: "asc" | "desc"
  loading: boolean
  totalPages: number
  onPageChange: (page: number) => void
  onSort: (field: string) => void
  onView: (utility: Utility) => void
  onEdit: (utility: Utility) => void
  onDelete: (utility: Utility) => void
}

export const UtilityServersideTable: React.FC<UtilityServersideTableProps> = ({
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
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage()

  const columns: ServersideTableColumn<Utility>[] = [
    {
      key: "number",
      title: t("common.number"),
      sortable: true,
      render: (utility) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{utility.number}</span>
        </div>
      ),
    },
    {
      key: "name",
      title: t("common.name"),
      sortable: true,
      render: (utility) => <span className="font-medium">{utility.name}</span>,
    },
    {
      key: "provider",
      title: t("utilities.provider"),
      sortable: true,
      render: (utility) => <span>{utility.provider}</span>,
    },
    {
      key: "location",
      title: t("utilities.location"),
      sortable: true,
      render: (utility) => <span>{utility.location}</span>,
    },
    {
      key: "status",
      title: t("utilities.status"),
      sortable: true,
      render: (utility) => (
        <Badge className={getUtilityStatusColor(utility.status!)}>
          {t(`utilities.${utility.status!.toLowerCase()}`)}
        </Badge>
      ),
    },
    {
      key: "costPerUnit",
      title: t("utilities.costPerUnit"),
      sortable: true,
      render: (utility) => (
        <div className="text-right">
          <div className="font-medium">{formatLargeCurrency(utility.costPerUnit!)}</div>
          <div className="text-xs text-muted-foreground">/{t(`utilities.${utility.unit!.toLowerCase()}`)}</div>
        </div>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      sortable: false,
      render: (utility) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(utility)}>
                <Eye className="mr-2 h-4 w-4" />
                {t("utilities.view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(utility)}>
                <Edit className="mr-2 h-4 w-4" />
                {t("utilities.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(utility)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("utilities.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <div className="hidden md:block">
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
