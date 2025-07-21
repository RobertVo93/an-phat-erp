"use client"

import { useLanguage } from "@/contexts/language-context"
import { formatDate } from "@/lib/utils"
import { StockChangeStatus, StockChangeType } from "@/types"
import { IReportStock } from "@/types/report-stock.interface"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo } from "react"

interface Props {
  data: IReportStock[]
}

export default function ReportStockTable({ data }: Props) {
  const { t } = useLanguage()

  const getTypeColor = (status: StockChangeType) => {
    switch (status) {
      case StockChangeType.stockIn:
        return "bg-[#4CAF50]"
      case StockChangeType.stockOut:
        return "bg-[#F44336]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const columns = useMemo<ColumnDef<IReportStock>[]>(
    () => [
      {
        accessorKey: "productName",
        header: t("rs.table.productName"),
      },
      {
        accessorKey: "quantity",
        header: t("rs.table.quantity"),
        cell: ({ row }) => {
          const quantity = row.original.quantity
          const unit = row.original.unit
          return `${quantity} ${t(`rs.table.${unit}`)}`
        },
      },
      {
        accessorKey: "totalCost",
        header: t("rs.table.totalExpense"),
        cell: ({ getValue }) => `${(getValue() as number).toLocaleString()} đ`,
      },
      {
        accessorKey: "type",
        header: t("rs.table.type"),
        cell: ({ getValue }) => {
          const type = getValue() as StockChangeType
          const colorClass = getTypeColor(type)
          return (
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}>
              {t(`rs.table.${type}`)}
            </span>
          )
        }
      },
      {
        accessorKey: "date",
        header: t("rs.table.time"),
        cell: ({ getValue }) => formatDate(getValue() as string)
      },
    ],
    [t]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-100">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                className="p-2 border border-gray-300 text-left"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className="hover:bg-gray-50">
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="p-2 border border-gray-300">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
