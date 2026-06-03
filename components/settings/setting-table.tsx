"use client"

import { ServersideTable, type ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import type { Setting } from "@/types/setting.interface"
import { SettingActions } from "./setting-actions"
import { getSettingTypeLabel } from "./setting-type-label"
import { SettingValue } from "./setting-value"

type SettingRow = Setting & { id: string | number }

interface SettingTableProps {
  data: Setting[]
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: "asc" | "desc"
  loading: boolean
  totalPages: number
  onPageChange: (page: number) => void
  onSort: (field: string) => void
  onView: (setting: Setting) => void
  onEdit: (setting: Setting) => void
}

export function SettingTable({
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
}: SettingTableProps) {
  const { t } = useLanguage()

  const columns: ServersideTableColumn<SettingRow>[] = [
    {
      key: "configType",
      title: t("settings.configType"),
      sortable: true,
      render: (setting) => <Badge variant="outline">{getSettingTypeLabel(setting.configType, t)}</Badge>,
    },
    {
      key: "key",
      title: t("settings.key"),
      sortable: true,
      render: (setting) => <span className="font-medium">{getSettingTypeLabel(setting.key, t)}</span>,
    },
    {
      key: "value",
      title: t("settings.value"),
      sortable: true,
      render: (setting) => <SettingValue setting={setting} />,
    },
    {
      key: "description",
      title: t("settings.description"),
      render: (setting) => <span className="text-muted-foreground">{setting.description || "-"}</span>,
    },
    {
      key: "actions",
      title: t("common.actions"),
      render: (setting) => (
        <SettingActions setting={setting} onView={onView} onEdit={onEdit} />
      ),
    },
  ]

  return (
    <ServersideTable
      columns={columns}
      data={data as SettingRow[]}
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
