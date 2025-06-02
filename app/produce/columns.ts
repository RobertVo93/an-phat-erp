"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export type Production = {
  id: string
  date: string
  product: string
  quantity: number
  unit: string
  status?: string
  statusText?: string
  shift?: string
  operator?: string
  efficiency?: number
  totalCost?: number
}

export const columns: ColumnDef<Production>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Mã",
  },
  {
    accessorKey: "date",
    header: "Ngày",
  },
  {
    accessorKey: "product",
    header: "Sản phẩm",
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
    cell: ({ row }) => {
      const quantity = Number.parseFloat(row.getValue("quantity"))
      const unit = row.original.unit

      return (
        <div>
          {quantity} {unit}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status
      const statusText = row.original.statusText || "N/A"

      return (
        <Badge
          variant="outline"
          className={
            status === "completed"
              ? "bg-green-100 text-green-800 border-green-200"
              : status === "in-progress"
                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                : status === "paused"
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : status === "cancelled"
                    ? "bg-red-100 text-red-800 border-red-200"
                    : "bg-gray-100 text-gray-800 border-gray-200"
          }
        >
          {statusText}
        </Badge>
      )
    },
  },
  {
    accessorKey: "shift",
    header: "Ca",
  },
  {
    accessorKey: "operator",
    header: "Người vận hành",
  },
  {
    accessorKey: "efficiency",
    header: "Hiệu suất",
    cell: ({ row }) => {
      const efficiency = row.original.efficiency

      return <div>{efficiency ? `${efficiency}%` : "N/A"}</div>
    },
  },
  {
    accessorKey: "totalCost",
    header: "Tổng chi phí",
    cell: ({ row }) => {
      const totalCost = row.original.totalCost

      return <div>{totalCost ? `${totalCost.toLocaleString()} đ` : "N/A"}</div>
    },
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: () => null,
  },
]
