import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"
import { ServersidePagination } from "@/components/common/table/ServersidePagination"
import { useLanguage } from "@/contexts/language-context"

export interface ServersideTableColumn<T> {
  key: keyof T | string
  title: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

interface ServersideTableProps<T> {
  columns: ServersideTableColumn<T>[]
  data: T[]
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: "asc" | "desc"
  onPageChange: (page: number) => void
  onSort: (key: string) => void
  loading?: boolean
  totalPages: number
  renderMobileRow?: (row: T) => React.ReactNode
  onRecordClick?: (value: any) => void
}

export function ServersideTable<T extends { id: string | number }>(props: ServersideTableProps<T>) {
  const { t } = useLanguage()
  const {
    columns,
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
    renderMobileRow,
    onRecordClick,
  } = props

  return (
    <div className="w-full">
      {/* Desktop table */}
      <div className="overflow-x-auto border rounded-md hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key as string} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.sortable ? (
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-medium flex items-center"
                      onClick={() => onSort(col.key as string)}
                    >
                      {col.title}
                      {sortBy === col.key ? (
                        sortOrder === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
                      ) : null}
                    </Button>
                  ) : (
                    col.title
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">{t("common.loading")}</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">{t("common.noData")}</td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700"
                      onClick={() => {
                        onRecordClick &&
                        onRecordClick(row.id)
                      }}  
                    >
                      {col.render ? col.render(row) : (row[col.key as keyof T] as any)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <div className="md:hidden">
        {loading ? (
          <div className="w-full text-center py-8 text-gray-400">{t("common.loading")}</div>
        ) : data.length === 0 ? (
          <div className="w-full text-center py-8 text-gray-400">{t("common.noData")}</div>
        ) : (
          <div className="space-y-2">
            {data.map((row) => (
              <div key={row.id} className="border rounded-md p-3 bg-white">
                {renderMobileRow ? (
                  renderMobileRow(row)
                ) : (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {columns.map((col) => (
                      <div key={col.key as string} className="col-span-2">
                        <div className="text-[11px] uppercase tracking-wide text-gray-500">{col.title}</div>
                        <div className="text-sm text-gray-800 mt-0.5">
                          {col.render ? col.render(row) : (row[col.key as keyof T] as any)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4">
        <ServersidePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
