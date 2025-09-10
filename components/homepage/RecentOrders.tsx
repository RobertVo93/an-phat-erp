"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import type { Order } from "@/types/order"
import { getOrderStatusColor, formatDate, formatLargeCurrency, formatDateTime } from "@/lib/utils"
import Link from "next/link"

interface RecentOrdersProps {
  data: Order[]
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: "asc" | "desc"
  totalPages: number
  loading: boolean
  onPageChange: (page: number) => void
  onSort: (key: string) => void
}

export function RecentOrders(props: RecentOrdersProps) {
  const { t } = useLanguage()
  const {
    data,
    total,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    totalPages,
    loading,
    onPageChange,
    onSort,
  } = props

  const getStatusText = (status: string) => t(`orders.status.${status}`)

  const columns: ServersideTableColumn<Order>[] = [
    {
      key: "number",
      title: t("orders.number"),
      sortable: false,
      render: (row) => (
        <div className="space-y-1">
          <Link href={`/orders/${row.id}`} className="hover:underline text-blue-500">
            <p className="text-sm font-medium">{row.number}</p>
          </Link>
          <p className="text-xs text-muted-foreground">{formatDate(row.createdAt!)}</p>
        </div>
      ),
    },
    {
      key: "customer",
      title: t("orders.customer"),
      sortable: false,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.customer?.name}</p>
          <p className="text-xs text-muted-foreground">{row.customer?.number}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("orders.status"),
      render: (row) => <Badge className={getOrderStatusColor(row.status!)}>{getStatusText(row.status!)}</Badge>,
    },
    {
      key: "totalAmount",
      title: t("orders.amount"),
      sortable: false,
      render: (row) => <span className="font-medium">{formatLargeCurrency(row.totalAmount || 0)}</span>,
    },
    {
      key: "deliveryDate",
      title: t("orders.expectedDelivery"),
      sortable: true,
      render: (row) => <span>{row.deliveryDate ? formatDateTime(row.deliveryDate) : "-"}</span>,
    },
  ]

  return (
    <Card className="col-span-5">
      <CardHeader>
        <CardTitle>{t("dashboard.recentOrders")}</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}


