"use client"

import { useLanguage } from "@/contexts/language-context"
import { formatDate, formatLargeCurrency, formatNumberWithCommas } from "@/lib/utils"
import { StockChangeType } from "@/types"
import { IReportStock } from "@/types/report-stock.interface"
import Link from "next/link"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo } from "react"
import { ADMIN_ROUTES } from "@/constants"

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
        cell: ({ row, getValue }) => {
          const productName = getValue() as string
          const stockChangeId = row.original.stockChangeId

          if (!stockChangeId) return productName

          return (
            <Link
              href={ADMIN_ROUTES.stockChangeDetail(stockChangeId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline-offset-2 hover:underline"
            >
              {productName}
            </Link>
          )
        },
      },
      {
        accessorKey: "quantity",
        header: t("rs.table.quantity"),
        cell: ({ row }) => {
          const quantity = row.original.quantity
          const unit = row.original.unit
          return `${formatNumberWithCommas(quantity)} ${t(`rs.table.${unit}`)}`
        },
      },
      {
        accessorKey: "totalCost",
        header: t("rs.table.totalExpense"),
        cell: ({ getValue }) => `${formatLargeCurrency(getValue() as number)}`,
      },
      {
        accessorKey: "type",
        header: t("rs.table.type"),
        cell: ({ row, getValue }) => {
          const type = getValue() as StockChangeType
          const colorClass = getTypeColor(type)
          let display = t(`rs.table.${type}`);
          if (row.original.isProductionRelated) {
              display += ` - ${t(`rs.table.production`)}`;
          }
          return (
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}>
              {display}
            </span>
          )
        }
      },
      {
        accessorKey: "date",
        header: t("rs.table.time"),
        cell: ({ getValue }) => formatDate(getValue() as string, "/")
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
