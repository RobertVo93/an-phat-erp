"use client"

import { useLanguage } from "@/contexts/language-context"
import { formatCurrency, formatDate } from "@/lib/utils"
import { IReportOrder, OrderStatus } from "@/types"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo } from "react"

interface Props {
  data: IReportOrder[]
}

export default function ReportOrderTable({ data }: Props) {
  const { t } = useLanguage()

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.completed:
        return "bg-green-100 text-green-800"
      case OrderStatus.processing:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.shipped:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.delivered:
        return "bg-purple-100 text-purple-800"
      case OrderStatus.pending:
        return "bg-gray-100 text-gray-800"
      case OrderStatus.cancelled:
        return "bg-red-100 text-red-800"
      case OrderStatus.lackProduct:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const columns = useMemo<ColumnDef<IReportOrder>[]>(
    () => [
      {
        accessorKey: "number",
        header: t("ro.table.number"),
      },
      {
        accessorKey: "customer",
        header: t("ro.table.customer"),
        cell: ({ row }) => {
          const name = row.original.customer?.name
          return `${name}`
        },
      },
      {
        accessorKey: "deliveryAddress",
        header: t("ro.table.deliveryAddress"),
      },
      {
        accessorKey: "status",
        header: t("ro.table.status"),
        cell: ({ getValue }) => {
          const status = getValue() as OrderStatus
          const colorClass = getStatusColor(status)
          return (
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}>
              {t(`ro.status.${status}`)}
            </span>
          )
        }
      },
      {
        accessorKey: "deliveryDate",
        header: t("ro.table.deliveryDate"),
        cell: ({ getValue }) => `${formatDate(`${getValue()}`)}`,
      },
      {
        accessorKey: "note",
        header: t("ro.table.note"),
      },
      {
        accessorKey: "paymentMethod",
        header: t("ro.table.paymentMethod"),
        cell: ({ getValue }) => `${t(`ro.payment.${getValue()}`)}`,
      },
      {
        accessorKey: "totalPrice",
        header: t("ro.table.totalPrice"),
        cell: ({ getValue }) => formatCurrency(Number(getValue())),
      },
      {
        accessorKey: "orderDate",
        header: t("ro.table.orderDate"),
        cell: ({ getValue }) => `${formatDate(`${getValue()}`)}`,
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
