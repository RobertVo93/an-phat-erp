"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { ServersidePagination } from "@/components/common/table/ServersidePagination"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { OrderFilterModal } from "@/components/orders/order-filter-modal"
import { OrderNewModal } from "@/components/orders/modals/OrderNewModal"
import { OrdersCardList } from "@/components/orders/OrdersCardList"
import { OrdersEmptyState } from "@/components/orders/OrdersEmptyState"
import { OrdersHeader } from "@/components/orders/OrdersHeader"
import { OrdersSearchFilterBar } from "@/components/orders/OrdersSearchFilterBar"
import { ADMIN_ROUTES } from "@/constants/nav"
import { useLanguage } from "@/contexts/language-context"
import { useOrdersPage } from "@/hooks/use-orders-page"
import type { IOrderPageData } from "@/lib/services/orderPageService"
import { formatCurrency, formatDate, formatDateTime, getOrderStatusColor } from "@/lib/utils"
import type { Order, OrderSortBy } from "@/types"
import { CustomLink } from "../common/custom-link"

interface IOrdersPageClientProps {
  initialData: IOrderPageData
}

type OrderTableRow = Order & { id: string }

const ORDER_SORT_FIELDS: OrderSortBy[] = ["orderDate", "deliveryDate", "totalAmount", "customer", "number"]

export function OrdersPageClient({ initialData }: IOrdersPageClientProps) {
  const { t } = useLanguage()
  const {
    orders,
    total,
    totalPages,
    loading,
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
  } = useOrdersPage(initialData)

  const getStatusText = (status: string) => t(`orders.status.${status}`)
  const tableRows = orders.filter((order): order is OrderTableRow => Boolean(order.id))
  const handleTableSort = (field: string) => {
    if (ORDER_SORT_FIELDS.includes(field as OrderSortBy)) {
      handleSort(field as OrderSortBy)
    }
  }

  const columns: ServersideTableColumn<OrderTableRow>[] = [
    {
      key: "number",
      title: t("orders.number"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <CustomLink href={ADMIN_ROUTES.orderDetail(row.id!)} text={row.number}/>
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
          {row.customer?.id && <CustomLink href={ADMIN_ROUTES.customerDetail(row.customer.id)} text={row.customer?.name}/>}
          <p className="text-xs text-muted-foreground">{row.customer?.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("orders.status"),
      render: (row) => (
        <Badge className={getOrderStatusColor(row.status!)}>{getStatusText(row.status!)}</Badge>
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
      render: (row) => row.deliveryDate ? formatDateTime(row.deliveryDate) : "-",
    },
    {
      key: "actions",
      title: t("common.actions"),
      render: (row) => (
        <div className="flex justify-center">
          <Link href={ADMIN_ROUTES.orderDetail(row.id)}>
            <Button variant="outline" size="sm">{t("common.view")}</Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className="space-y-4 sm:space-y-6">
        <OrdersHeader onNewOrderClick={() => setShowNewOrderModal(true)} />
        <OrdersSearchFilterBar
          searchTerm={searchTerm}
          activeFiltersCount={activeFiltersCount}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearchTermChange={setSearchTerm}
          onShowFilter={() => setShowFilterModal(true)}
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
                  data={tableRows}
                  total={total}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onPageChange={handlePageChange}
                  showPageSize
                  onPageSizeChange={setPageSize}
                  resetPageOnPageSizeChange={false}
                  onSort={handleTableSort}
                  loading={loading}
                  totalPages={totalPages}
                />
              </div>
              <div className="lg:hidden">
                <OrdersCardList orders={orders} getStatusText={getStatusText} />
                <div className="mt-4">
                  <ServersidePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    total={total}
                    onPageChange={handlePageChange}
                    showPageSize
                    onPageSizeChange={setPageSize}
                    resetPageOnPageSizeChange={false}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <OrderNewModal
        open={showNewOrderModal}
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
    </>
  )
}
