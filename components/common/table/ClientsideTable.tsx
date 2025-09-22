import React, { useState, useMemo } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IBase } from "@/types/base.interface"
import { ClientsidePagination } from "@/components/common/table/ClientsidePagination"

export interface ClientsideTableColumn<T> {
  key: keyof T | string
  title: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

interface ClientsideTableProps<T> {
  columns: ClientsideTableColumn<T>[]
  data: T[]
  pageSize?: number
  initialSortBy?: string
  initialSortOrder?: "asc" | "desc"
}

export function ClientsideTable<T extends IBase>(props: ClientsideTableProps<T>) {
  const {
    columns,
    data,
    pageSize = 10,
    initialSortBy,
    initialSortOrder = "asc",
  } = props

  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<string>(initialSortBy || (columns.find(col => col.sortable)?.key as string) || "")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder)

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortBy) return data
    const col = columns.find(c => c.key === sortBy)
    if (!col || !col.sortable) return data
    return [...data].sort((a, b) => {
      const aValue = a[sortBy as keyof T]
      const bValue = b[sortBy as keyof T]
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortOrder === "asc" ? -1 : 1
      if (bValue == null) return sortOrder === "asc" ? 1 : -1
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [data, sortBy, sortOrder, columns])

  // Pagination
  const total = sortedData.length
  const totalPages = Math.ceil(total / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key as string} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.sortable ? (
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-medium flex items-center"
                      onClick={() => handleSort(col.key as string)}
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
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">No data</td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {col.render ? col.render(row) : (row[col.key as keyof T] as any)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <ClientsidePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>    
    </div>
  )
}
