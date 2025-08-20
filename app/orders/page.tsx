"use client"

import Link from "next/link"
import { ERPLayout } from "@/components/erp-layout"
import { OrdersHeader } from "@/components/orders/OrdersHeader"
import { OrdersSearchFilterBar } from "@/components/orders/OrdersSearchFilterBar"
import { OrdersCardList } from "@/components/orders/OrdersCardList"
import { OrdersLoadingOverlay } from "@/components/orders/OrdersLoadingOverlay"
import { OrdersEmptyState } from "@/components/orders/OrdersEmptyState"
import { NewOrderModal } from "@/components/modals/new-order-modal"
import { OrderFilterModal } from "@/components/orders/order-filter-modal"
import { useLanguage } from "@/contexts/language-context"
import { useOrdersPage } from "@/hooks/use-orders-page"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { formatCurrency, formatDate, getOrderStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const { t } = useLanguage()
  const {
    orders,
    total,
    totalPages,
    loading,
    allCustomers,
    allWarehouses,
    showNewOrderModal,
    showFilterModal,
    searchTerm,
    filters,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    activeFiltersCount,
    setShowNewOrderModal,
    setShowFilterModal,
    setSearchTerm,
    setPageSize,
    handleSort,
    handlePageChange,
    handleFiltersChange,
    createOrder,
  } = useOrdersPage()

  const getStatusText = (status: string) => t(`orders.status.${status}`)

  // Define columns for ServersideTable
  const columns: ServersideTableColumn<any>[] = [
    {
      key: "orderNumber",
      title: t("orders.orderNumber"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.orderNumber}</p>
          <p className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "customer",
      title: t("orders.customer"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.customer?.name}</p>
          <p className="text-xs text-muted-foreground">{row.customer?.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("orders.status"),
      render: (row) => (
        <Badge className={getOrderStatusColor(row.status)}>{getStatusText(row.status)}</Badge>
      ),
    },
    {
      key: "paymentStatus",
      title: t("orders.payment"),
      render: (row) => (
        <Badge variant="outline">{t(`orders.paymentStatus.${row.paymentStatus}`)}</Badge>
      ),
    },
    {
      key: "totalAmount",
      title: t("orders.amount"),
      sortable: true,
      render: (row) => <span className="font-medium">{formatCurrency(row.totalAmount)}</span>,
    },
    {
      key: "deliveryDate",
      title: t("orders.expectedDelivery"),
      sortable: true,
      render: (row) => row.deliveryDate ? formatDate(row.deliveryDate) : "-",
    },
    {
      key: "actions",
      title: t("common.actions"),
      render: (row) => (
        <div className="flex justify-center">
          <Link href={`/orders/${row.id}`}>
            <Button variant="outline" size="sm">{t("common.view")}</Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <ERPLayout>
      <OrdersLoadingOverlay loading={loading} />
      <div className="space-y-4 sm:space-y-6">
        <OrdersHeader onNewOrderClick={() => setShowNewOrderModal(true)} />
        <OrdersSearchFilterBar
          searchTerm={searchTerm}
          activeFiltersCount={activeFiltersCount}
          pageSize={pageSize}
          setSearchTerm={v => { setSearchTerm(v); handlePageChange(1) }}
          onFilterClick={() => setShowFilterModal(true)}
          setPageSize={v => { setPageSize(v); handlePageChange(1) }}
          onSort={handleSort}
        />
        <div className="p-0">
          {orders.length === 0 ? (
            <OrdersEmptyState onNewOrderClick={() => setShowNewOrderModal(true)} />
          ) : (
            <>
              <div className="hidden lg:block">
                <ServersideTable
                  columns={columns}
                  data={orders}
                  total={total}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onPageChange={handlePageChange}
                  onSort={handleSort}
                  loading={loading}
                  totalPages={totalPages}
                />
              </div>
              <div className="lg:hidden">
                <OrdersCardList
                  orders={orders}
                  getStatusText={getStatusText}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <NewOrderModal
        open={showNewOrderModal}
        customers={allCustomers}
        allWarehouses={allWarehouses}
        onOpenChange={setShowNewOrderModal}
        createOrder={createOrder}
      />
      <OrderFilterModal
        open={showFilterModal}
        filters={filters}
        onOpenChange={setShowFilterModal}
        onFiltersChange={handleFiltersChange}
      />
    </ERPLayout>
  )
}
